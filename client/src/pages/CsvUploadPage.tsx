import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/typography/PageHeader';
import { Button } from '../components/ui/Button';
import { SelectBox } from '../components/ui/SelectBox';
import { StatusBadge } from '../components/ui/StatusBadge';
import { FileDropzone } from '../components/upload/FileDropzone';
import { GuidedUploadLayout } from '../components/upload/GuidedUploadLayout';
import { StepNavigation } from '../components/upload/StepNavigation';
import { UploadProgress } from '../components/upload/UploadProgress';
import { UploadStepSection } from '../components/upload/UploadStepSection';
import { useGuidedUpload } from '../hooks/useGuidedUpload';
import { uploadCsv } from '../services/uploadService';
import { ReviewList } from './CsvUploadPage.styles';
import { ErrorText, SuccessBox } from './shared/uploadPage.styles';

const CSV_STEPS = [
  {
    id: 'type',
    title: 'What are you uploading?',
    body: 'Pick the dataset type so we can route and tag your file correctly.',
  },
  {
    id: 'file',
    title: 'Choose your CSV',
    body: 'Drag and drop or browse. One file per upload, up to 25 MB.',
  },
  {
    id: 'review',
    title: 'Review details',
    body: 'Confirm dataset type and filename before sending to the server.',
  },
  {
    id: 'upload',
    title: 'Upload',
    body: 'We send your file to the API and return an upload ID for tracking.',
  },
];

const DATASET_OPTIONS = [
  { value: 'work_orders', label: 'Work orders' },
  { value: 'parts_inventory', label: 'Parts inventory' },
  { value: 'timesheets', label: 'Timesheets' },
];

interface CsvUploadData {
  datasetType: string;
  file: File | null;
}

const initialData: CsvUploadData = {
  datasetType: '',
  file: null,
};

export function CsvUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{ uploadId: string } | null>(null);

  const guided = useGuidedUpload<CsvUploadData>(
    CSV_STEPS,
    initialData,
    (stepIndex, data) => {
      if (stepIndex === 0) return !!data.datasetType;
      if (stepIndex === 1) return !!data.file;
      if (stepIndex === 2) return !!data.file;
      return true;
    },
  );

  const stepEnabled = (index: number) => index <= guided.currentIndex;

  const handleNext = async () => {
    if (guided.currentIndex < 3) {
      guided.goNext();
      return;
    }

    if (!guided.data.file) return;

    setUploading(true);
    setUploadError(null);
    setProgress(0);

    try {
      const result = await uploadCsv(
        guided.data.file,
        { datasetType: guided.data.datasetType },
        setProgress,
      );
      setUploadResult({ uploadId: result.uploadId });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const datasetLabel =
    DATASET_OPTIONS.find((o) => o.value === guided.data.datasetType)?.label ??
    guided.data.datasetType;

  const stepState = (index: number) => ({
    disabled: !stepEnabled(index),
    done: index < guided.currentIndex,
    active: index === guided.currentIndex,
  });

  return (
    <PageContainer>
      <PageHeader
        title="CSV"
        gradientPhrase="upload"
        subtitle="Guided import for maintenance data"
        subtext="All steps are visible below—complete each section to unlock the next."
      />
      <GuidedUploadLayout
        footer={
          !uploadResult ? (
            <StepNavigation
              isFirst={guided.isFirst}
              isLast={guided.isLast}
              canAdvance={guided.canAdvance && !uploading}
              onBack={guided.goBack}
              onNext={handleNext}
              nextLabel={guided.isLast ? 'Upload →' : undefined}
              loading={uploading}
            />
          ) : undefined
        }
      >
        <UploadStepSection stepNumber={1} title={CSV_STEPS[0].title} body={CSV_STEPS[0].body} {...stepState(0)}>
          <SelectBox
            label="Dataset"
            name="datasetType"
            options={DATASET_OPTIONS}
            value={guided.data.datasetType}
            onChange={(value) => {
              guided.updateData({ datasetType: value });
              if (guided.currentIndex === 0) guided.goNext();
            }}
            hint="This metadata is sent with your file to the upload API."
            disabled={!stepEnabled(0)}
          />
        </UploadStepSection>

        <UploadStepSection stepNumber={2} title={CSV_STEPS[1].title} body={CSV_STEPS[1].body} {...stepState(1)}>
          <FileDropzone
            accept=".csv"
            files={guided.data.file ? [guided.data.file] : []}
            onFilesChange={(files) => guided.updateData({ file: files[0] ?? null })}
            maxSizeBytes={25 * 1024 * 1024}
            disabled={!stepEnabled(1)}
          />
        </UploadStepSection>

        <UploadStepSection stepNumber={3} title={CSV_STEPS[2].title} body={CSV_STEPS[2].body} {...stepState(2)}>
          <ReviewList>
            <dt>Dataset</dt>
            <dd>{datasetLabel}</dd>
            <dt>File</dt>
            <dd>{guided.data.file?.name ?? '—'}</dd>
            <dt>Size</dt>
            <dd>
              {guided.data.file ? `${(guided.data.file.size / 1024).toFixed(1)} KB` : '—'}
            </dd>
          </ReviewList>
          {stepEnabled(2) && <StatusBadge variant="success">Ready</StatusBadge>}
        </UploadStepSection>

        <UploadStepSection stepNumber={4} title={CSV_STEPS[3].title} body={CSV_STEPS[3].body} {...stepState(3)}>
          {uploadResult ? (
            <>
              <SuccessBox>
                <p>
                  <strong>Upload ID:</strong> {uploadResult.uploadId}
                </p>
              </SuccessBox>
              <Button
                onClick={() => {
                  setUploadResult(null);
                  setUploadError(null);
                  guided.reset();
                }}
              >
                Upload another file
              </Button>
            </>
          ) : (
            <>
              {uploading && <UploadProgress percent={progress} label="Uploading CSV" />}
              {uploadError && <ErrorText>{uploadError}</ErrorText>}
              {stepEnabled(3) && !uploading && !uploadError && (
                <StatusBadge variant="neutral">Use Upload below when ready</StatusBadge>
              )}
            </>
          )}
        </UploadStepSection>
      </GuidedUploadLayout>
    </PageContainer>
  );
}
