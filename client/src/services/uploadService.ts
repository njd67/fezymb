export type UploadKind = 'csv' | 'pdf';

export interface UploadResult {
  uploadId: string;
  fileNames: string[];
}

const CSV_MAX_BYTES = 25 * 1024 * 1024;
const PDF_MAX_BYTES = 50 * 1024 * 1024;

function uploadWithProgress(
  url: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText) as UploadResult & { error?: string };
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ uploadId: body.uploadId, fileNames: body.fileNames });
        } else {
          reject(new Error(body.error ?? 'Upload failed'));
        }
      } catch {
        reject(new Error('Invalid server response'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export function validateCsvFile(file: File): string | null {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return 'Please select a .csv file.';
  }
  if (file.size > CSV_MAX_BYTES) {
    return 'CSV file must be 25 MB or smaller.';
  }
  return null;
}

export function validatePdfFiles(files: File[]): string | null {
  if (!files.length) return 'Please select at least one PDF.';
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > PDF_MAX_BYTES) {
    return 'Total upload size must be 50 MB or smaller.';
  }
  for (const file of files) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return `"${file.name}" is not a PDF.`;
    }
  }
  return null;
}

export async function uploadCsv(
  file: File,
  metadata: Record<string, string>,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  const validationError = validateCsvFile(file);
  if (validationError) throw new Error(validationError);

  const formData = new FormData();
  formData.append('file', file);
  for (const [key, value] of Object.entries(metadata)) {
    formData.append(key, value);
  }

  return uploadWithProgress('/api/uploads/csv', formData, onProgress);
}

export async function uploadPdf(
  files: File[],
  metadata: Record<string, string>,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  const validationError = validatePdfFiles(files);
  if (validationError) throw new Error(validationError);

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  for (const [key, value] of Object.entries(metadata)) {
    formData.append(key, value);
  }

  return uploadWithProgress('/api/uploads/pdf', formData, onProgress);
}
