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
import { uploadPdf } from '../services/uploadService';
import { Meta, ReviewList } from './PdfUploadPage.styles';
import { ErrorText, SuccessBox } from './shared/uploadPage.styles';

const PDF_STEPS = [
  {
    id: 'category',
    title: 'Document category',
    body: 'Tag uploads as AMM, IPC, work package, or other for downstream search.',
  },
  {
    id: 'files',
    title: 'Choose PDFs',
    body: 'Add one or more manuals. Combined size up to 50 MB.',
  },
  {
    id: 'review',
    title: 'Review batch',
    body: 'Check category, file list, and total size before upload.',
  },
  {
    id: 'upload',
    title: 'Upload',
    body: 'All files go in one multipart request to the PDF endpoint.',
  },
];

const CATEGORY_OPTIONS = [
  { value: 'amm', label: 'AMM' },
  { value: 'ipc', label: 'IPC' },
  { value: 'work_package', label: 'Work package' },
  { value: 'other', label: 'Other' },
];

interface PdfUploadData {
  docCategory: string;
  files: File[];
}

const initialData: PdfUploadData = {
  docCategory: '',
  files: [],
};

function totalBytes(files: File[]): number {
  return files.reduce((sum, f) => sum + f.size, 0);
}

export function PdfUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{ uploadId: string; fileNames: string[] } | null>(
    null,
  );

  const guided = useGuidedUpload<PdfUploadData>(
    PDF_STEPS,
    initialData,
    (stepIndex, data) => {
      if (stepIndex === 0) return !!data.docCategory;
      if (stepIndex === 1) return data.files.length > 0;
      if (stepIndex === 2) return data.files.length > 0;
      return true;
    },
  );

  const stepEnabled = (index: number) => index <= guided.currentIndex;

  const handleNext = async () => {
    if (guided.currentIndex < 3) {
      guided.goNext();
      return;
    }

    if (!guided.data.files.length) return;

    setUploading(true);
    setUploadError(null);
    setProgress(0);

    try {
      const result = await uploadPdf(
        guided.data.files,
        { docCategory: guided.data.docCategory },
        setProgress,
      );
      setUploadResult({ uploadId: result.uploadId, fileNames: result.fileNames });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const categoryLabel =
    CATEGORY_OPTIONS.find((o) => o.value === guided.data.docCategory)?.label ??
    guided.data.docCategory;

  const stepState = (index: number) => ({
    disabled: !stepEnabled(index),
    done: index < guided.currentIndex,
    active: index === guided.currentIndex,
  });

  return (
    <PageContainer>
      <PageHeader
        title="PDF"
        gradientPhrase="upload"
        subtitle="Guided import for manuals and work packages"
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
        <UploadStepSection stepNumber={1} title={PDF_STEPS[0].title} body={PDF_STEPS[0].body} {...stepState(0)}>
          <SelectBox
            label="Document category"
            name="docCategory"
            options={CATEGORY_OPTIONS}
            value={guided.data.docCategory}
            onChange={(value) => {
              guided.updateData({ docCategory: value });
              if (guided.currentIndex === 0) guided.goNext();
            }}
            disabled={!stepEnabled(0)}
          />
        </UploadStepSection>

        <UploadStepSection stepNumber={2} title={PDF_STEPS[1].title} body={PDF_STEPS[1].body} {...stepState(1)}>
          <FileDropzone
            accept=".pdf"
            multiple
            files={guided.data.files}
            onFilesChange={(files) => guided.updateData({ files })}
            maxSizeBytes={50 * 1024 * 1024}
            disabled={!stepEnabled(1)}
          />
        </UploadStepSection>

        <UploadStepSection stepNumber={3} title={PDF_STEPS[2].title} body={PDF_STEPS[2].body} {...stepState(2)}>
          <Meta>
            <strong>{categoryLabel}</strong> · {guided.data.files.length} file
            {guided.data.files.length !== 1 ? 's' : ''}
            {guided.data.files.length > 0 &&
              ` · ${(totalBytes(guided.data.files) / (1024 * 1024)).toFixed(2)} MB total`}
          </Meta>
          <ReviewList>
            {guided.data.files.map((f) => (
              <li key={`${f.name}-${f.size}`}>
                <span>{f.name}</span>
                <span>{(f.size / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ReviewList>
          {stepEnabled(2) && guided.data.files.length > 0 && (
            <StatusBadge variant="success">Ready</StatusBadge>
          )}
        </UploadStepSection>

        <UploadStepSection stepNumber={4} title={PDF_STEPS[3].title} body={PDF_STEPS[3].body} {...stepState(3)}>
          {uploadResult ? (
            <>
              <SuccessBox>
                <p>
                  <strong>Upload ID:</strong> {uploadResult.uploadId}
                </p>
                <p style={{ marginTop: 8 }}>
                  <strong>Files:</strong> {uploadResult.fileNames.join(', ')}
                </p>
              </SuccessBox>
              <Button
                onClick={() => {
                  setUploadResult(null);
                  setUploadError(null);
                  guided.reset();
                }}
              >
                Upload more files
              </Button>
            </>
          ) : (
            <>
              {uploading && <UploadProgress percent={progress} label="Uploading PDFs" />}
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
