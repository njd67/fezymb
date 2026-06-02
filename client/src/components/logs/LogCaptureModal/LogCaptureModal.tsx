import { useQueryClient } from '@tanstack/react-query';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Button, ButtonRow } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { SelectBox } from '../../ui/SelectBox';
import { StatusBadge } from '../../ui/StatusBadge';
import { TextArea } from '../../ui/TextArea';
import { MicDeviceSelect } from '../MicDeviceSelect';
import { StructuredLogForm } from '../StructuredLogForm';
import { useAudioRecorder } from '../../../hooks/useAudioRecorder';
import { useCommitLog } from '../../../hooks/logs/useCommitLog';
import {
  getLogStatusErrorMessage,
  resetLogStatusPollCount,
  useLogStatus,
} from '../../../hooks/logs/useLogStatus';
import { logQueryKeys } from '../../../hooks/logs/logQueryKeys';
import { useIngestLog } from '../../../hooks/logs/useIngestLog';
import { useSubmitLog } from '../../../hooks/logs/useSubmitLog';
import {
  isLogFailed,
  isLogStructuringComplete,
  normalizeStructuredData,
  type LogStatusResponse,
  type StructuredLogData,
} from '../../../services/logService';
import { Spinner } from '../../ui/Spinner';
import { ErrorText } from '../../../pages/shared/uploadPage.styles';
import {
  EmptyValue,
  LoadingBlock,
  LoadingLabel,
  MainBody,
  MainCloseButton,
  MainHeader,
  MainPane,
  ModalSplit,
  ResultLabel,
  ResultRow,
  ResultsGrid,
  ResultValue,
  Sidebar,
  SidebarBadge,
  SidebarContent,
  SidebarStepSubtitle,
  SidebarStepTitle,
  SidebarTitle,
  StepPane,
  StepStack,
} from './LogCaptureModal.styles';

type LogCaptureStep =
  | 'setup'
  | 'transcribing'
  | 'review'
  | 'structuring'
  | 'draft'
  | 'complete'
  | 'failed';

const PROGRESS_STEPS: LogCaptureStep[] = [
  'setup',
  'transcribing',
  'review',
  'structuring',
  'draft',
  'complete',
];

function getStepProgress(step: LogCaptureStep): number {
  const index = PROGRESS_STEPS.indexOf(step);
  if (index < 0) return 25;
  const start = 25;
  const range = 100 - start;
  return Math.round(start + (index / (PROGRESS_STEPS.length - 1)) * range);
}

const COMPONENT_OPTIONS = [
  { value: 'landing_gear', label: 'Landing gear' },
  { value: 'engine', label: 'Engine' },
  { value: 'avionics', label: 'Avionics' },
];

const STEP_COPY: Record<LogCaptureStep, { title: string; subtitle: string }> = {
  setup: {
    title: 'Record voice note',
    subtitle: 'Choose your microphone and an optional component hint, then start recording.',
  },
  transcribing: {
    title: 'Transcribing',
    subtitle: 'Converting your voice note to text.',
  },
  review: {
    title: 'Review transcript',
    subtitle: 'Correct any misheard words before submitting for structuring.',
  },
  structuring: {
    title: 'Structuring',
    subtitle: 'AI is extracting maintenance fields from your transcript.',
  },
  draft: {
    title: 'Review structured fields',
    subtitle: 'Edit the extracted fields before committing to the ledger.',
  },
  complete: {
    title: 'Log committed',
    subtitle: 'Your maintenance log has been saved to the asset ledger.',
  },
  failed: {
    title: 'Something went wrong',
    subtitle: 'The log could not be processed. You can try again or close this dialog.',
  },
};

function getStepBadge(step: LogCaptureStep, isRecording: boolean): ReactNode {
  switch (step) {
    case 'setup':
      return isRecording ? <StatusBadge variant="warning">Recording</StatusBadge> : null;
    case 'review':
      return <StatusBadge variant="neutral">Transcribed</StatusBadge>;
    case 'structuring':
      return <StatusBadge variant="neutral">Structuring</StatusBadge>;
    case 'draft':
      return <StatusBadge variant="warning">Drafted</StatusBadge>;
    case 'complete':
      return <StatusBadge variant="success">Committed</StatusBadge>;
    case 'failed':
      return <StatusBadge variant="error">Failed</StatusBadge>;
    default:
      return null;
  }
}

const RESULT_FIELDS: { key: keyof StructuredLogData; label: string }[] = [
  { key: 'action', label: 'Action' },
  { key: 'part_number', label: 'Part number' },
  { key: 'reference', label: 'Reference' },
  { key: 'torque', label: 'Torque' },
];

interface LogCaptureModalProps {
  open: boolean;
  onClose: () => void;
}

function formatResultValue(value: string): ReactNode {
  return value.trim() ? value : <EmptyValue>Not applicable</EmptyValue>;
}

function deriveStep(
  statusData: LogStatusResponse | undefined,
  opts: {
    forcedFailedMessage: string | null;
    commitSuccess: boolean;
    structuredData: StructuredLogData | null;
    structuringSubmitted: boolean;
    submitPending: boolean;
    ingestPending: boolean;
    logId: string | null;
  },
): LogCaptureStep {
  if (opts.forcedFailedMessage) return 'failed';
  if (opts.commitSuccess) return 'complete';
  if (isLogFailed(statusData)) return 'failed';

  const draftReady = isLogStructuringComplete(statusData);
  if (draftReady) return 'draft';
  if (opts.structuringSubmitted || opts.submitPending) return 'structuring';
  if (opts.ingestPending) return 'transcribing';
  if (opts.logId) return 'review';
  return 'setup';
}

export function LogCaptureModal({ open, onClose }: LogCaptureModalProps) {
  const queryClient = useQueryClient();
  const [componentType, setComponentType] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [logId, setLogId] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');
  const [structuringSubmitted, setStructuringSubmitted] = useState(false);
  const [structuredData, setStructuredData] = useState<StructuredLogData | null>(null);
  const [forcedFailedMessage, setForcedFailedMessage] = useState<string | null>(null);

  const ingest = useIngestLog();
  const submit = useSubmitLog();
  const commit = useCommitLog();

  const isStructuringStep =
    structuringSubmitted && !commit.isSuccess && !forcedFailedMessage;

  const statusQuery = useLogStatus({
    logId,
    enabled: open && isStructuringStep && !!logId && !ingest.isPending,
  });

  const step = useMemo(
    () =>
      deriveStep(statusQuery.data, {
        forcedFailedMessage,
        commitSuccess: commit.isSuccess,
        structuredData,
        structuringSubmitted,
        submitPending: submit.isPending,
        ingestPending: ingest.isPending,
        logId,
      }),
    [
      statusQuery.data,
      forcedFailedMessage,
      commit.isSuccess,
      structuredData,
      structuringSubmitted,
      submit.isPending,
      ingest.isPending,
      logId,
    ],
  );

  useEffect(() => {
    const data = statusQuery.data;
    if (!data) return;

    if (isLogStructuringComplete(data) && data.structured_data) {
      setStructuredData(normalizeStructuredData(data.structured_data));
    }
  }, [statusQuery.data]);

  useEffect(() => {
    const statusError = getLogStatusErrorMessage(statusQuery.error);
    if (statusError && isStructuringStep) {
      setForcedFailedMessage(statusError);
    }
  }, [statusQuery.error, isStructuringStep]);

  useEffect(() => {
    if (ingest.error instanceof Error) {
      setForcedFailedMessage(ingest.error.message);
    }
  }, [ingest.error]);

  useEffect(() => {
    if (submit.error instanceof Error) {
      setForcedFailedMessage(submit.error.message);
    }
  }, [submit.error]);

  const handleRecordingStop = (blob: Blob) => {
    setLogId(null);
    setRawText('');
    setStructuringSubmitted(false);
    setStructuredData(null);
    setForcedFailedMessage(null);
    ingest.mutate(
      { audio: blob, componentType: componentType || undefined },
      {
        onSuccess: ({ logId: id, rawText: text }) => {
          setLogId(id);
          setRawText(text);
        },
      },
    );
  };

  const recorder = useAudioRecorder({
    deviceId,
    onStop: handleRecordingStop,
  });

  useEffect(() => {
    if (recorder.devices.length && !deviceId) {
      setDeviceId(recorder.devices[0].deviceId);
    }
  }, [recorder.devices, deviceId]);

  const resetFlow = () => {
    ingest.reset();
    submit.reset();
    commit.reset();
    if (logId) {
      resetLogStatusPollCount(logId);
      queryClient.removeQueries({ queryKey: logQueryKeys.status(logId) });
    }
    setLogId(null);
    setRawText('');
    setStructuringSubmitted(false);
    setStructuredData(null);
    setForcedFailedMessage(null);
  };

  const prevOpen = useRef(false);

  useEffect(() => {
    if (open && !prevOpen.current) {
      resetFlow();
    }
    prevOpen.current = open;
  }, [open]);

  const handleClose = () => {
    if (recorder.phase === 'recording') return;
    if (step !== 'failed') {
      resetFlow();
    }
    onClose();
  };

  const handleFailedClose = () => {
    onClose();
  };

  const handleDone = () => {
    resetFlow();
    onClose();
  };

  const handleTryAgain = () => {
    resetFlow();
  };

  const handleStart = () => {
    ingest.reset();
    submit.reset();
    commit.reset();
    setLogId(null);
    setRawText('');
    setStructuringSubmitted(false);
    setStructuredData(null);
    setForcedFailedMessage(null);
    void recorder.startRecording();
  };

  const handleSubmitForStructuring = () => {
    if (!logId || !rawText.trim()) return;
    submit.mutate(
      { logId, rawText },
      {
        onSuccess: () => setStructuringSubmitted(true),
      },
    );
  };

  const handleCommit = () => {
    if (!logId || !structuredData) return;
    commit.mutate({ logId, structuredData });
  };

  const busy =
    recorder.phase === 'recording' ||
    ingest.isPending ||
    submit.isPending ||
    (step === 'structuring' && !isLogFailed(statusQuery.data)) ||
    commit.isPending;

  const canRecord =
    !busy &&
    step === 'setup' &&
    recorder.devices.length > 0 &&
    !recorder.permissionError;

  const allowClose =
    step !== 'transcribing' &&
    step !== 'structuring' &&
    recorder.phase !== 'recording' &&
    !commit.isPending &&
    !submit.isPending;

  const failedMessage =
    forcedFailedMessage ||
    statusQuery.data?.error_message ||
    (ingest.error instanceof Error ? ingest.error.message : null) ||
    (submit.error instanceof Error ? submit.error.message : null) ||
    getLogStatusErrorMessage(statusQuery.error);

  const commitError =
    commit.error instanceof Error ? commit.error.message : null;

  const stepBadge = getStepBadge(step, recorder.phase === 'recording');
  const stepCopy = STEP_COPY[step];

  const renderStep = () => {
    switch (step) {
      case 'setup':
        return (
          <StepPane key="setup">
            <MicDeviceSelect
              devices={recorder.devices}
              value={deviceId}
              onChange={setDeviceId}
              disabled={recorder.phase === 'recording'}
              hint="Allow microphone access to list devices."
            />
            <SelectBox
              label="Component type"
              name="component_type"
              options={COMPONENT_OPTIONS}
              value={componentType}
              onChange={setComponentType}
              hint="Optional schema hint for structuring."
              disabled={recorder.phase === 'recording'}
            />
            {recorder.permissionError && (
              <ErrorText>{recorder.permissionError}</ErrorText>
            )}
            {recorder.phase !== 'recording' ? (
              <Button variant="primary" onClick={handleStart} disabled={!canRecord} fullWidth>
                Start recording
              </Button>
            ) : (
              <Button variant="primary" onClick={() => recorder.stopRecording()} fullWidth>
                Stop recording
              </Button>
            )}
          </StepPane>
        );

      case 'transcribing':
        return (
          <StepPane key="transcribing">
            <LoadingBlock>
              <Spinner aria-hidden />
              <LoadingLabel>Transcribing your recording…</LoadingLabel>
            </LoadingBlock>
          </StepPane>
        );

      case 'review':
        return (
          <StepPane key="review">
            <TextArea
              label="Voice note text"
              hint="Edit the transcript if anything was misheard."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="No transcript yet"
            />
            <Button
              variant="primary"
              onClick={handleSubmitForStructuring}
              disabled={submit.isPending || !rawText.trim()}
              fullWidth
            >
              Submit for structuring
            </Button>
          </StepPane>
        );

      case 'structuring':
        return (
          <StepPane key="structuring">
            <TextArea
              label="Voice note text"
              hint="Transcript from speech recognition."
              value={rawText}
              readOnly
            />
            <LoadingBlock>
              <Spinner aria-hidden />
              <LoadingLabel>Extracting structured fields…</LoadingLabel>
            </LoadingBlock>
          </StepPane>
        );

      case 'draft':
        return (
          <StepPane key="draft">
            {structuredData && (
              <StructuredLogForm
                data={structuredData}
                onChange={setStructuredData}
                disabled={commit.isPending}
              />
            )}
            {commitError && <ErrorText>{commitError}</ErrorText>}
            <Button
              variant="primary"
              onClick={handleCommit}
              disabled={commit.isPending || !structuredData}
              fullWidth
            >
              Save & commit
            </Button>
          </StepPane>
        );

      case 'complete':
        return (
          <StepPane key="complete">
            {structuredData && (
              <ResultsGrid>
                {RESULT_FIELDS.map(({ key, label }) => (
                  <ResultRow key={key}>
                    <ResultLabel>{label}</ResultLabel>
                    <ResultValue>{formatResultValue(structuredData[key])}</ResultValue>
                  </ResultRow>
                ))}
              </ResultsGrid>
            )}
            <Button variant="primary" onClick={handleDone} fullWidth>
              Done
            </Button>
          </StepPane>
        );

      case 'failed':
        return (
          <StepPane key="failed">
            {failedMessage && <ErrorText>{failedMessage}</ErrorText>}
            <ButtonRow>
              <Button variant="secondary" onClick={handleFailedClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleTryAgain}>
                Try again
              </Button>
            </ButtonRow>
          </StepPane>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      allowClose={allowClose}
      closeOnBackdrop={allowClose}
      progress={getStepProgress(step)}
      showHeader={false}
      wide
      flushBody
    >
      <ModalSplit>
        <Sidebar>
          <SidebarTitle id="modal-title">Maintenance log capture</SidebarTitle>
          <SidebarContent key={step}>
            {stepBadge && <SidebarBadge>{stepBadge}</SidebarBadge>}
            <SidebarStepTitle>{stepCopy.title}</SidebarStepTitle>
            <SidebarStepSubtitle>{stepCopy.subtitle}</SidebarStepSubtitle>
          </SidebarContent>
        </Sidebar>
        <MainPane>
          <MainHeader>
            <MainCloseButton
              type="button"
              aria-label="Close"
              onClick={handleClose}
              disabled={!allowClose}
            >
              ×
            </MainCloseButton>
          </MainHeader>
          <MainBody>
            <StepStack>{renderStep()}</StepStack>
          </MainBody>
        </MainPane>
      </ModalSplit>
    </Modal>
  );
}
