import { apiBase } from './apiBase';

export type LogStatus =
  | 'transcribed'
  | 'pending'
  | 'processing'
  | 'draft'
  | 'committed'
  | 'failed';

export interface StructuredLogData {
  action: string;
  part_number: string;
  reference: string;
  torque: string;
}

export const EMPTY_STRUCTURED_LOG: StructuredLogData = {
  action: '',
  part_number: '',
  reference: '',
  torque: '',
};

export interface TranscribeResponse {
  log_id: string;
  status: LogStatus;
  raw_text: string;
}

export interface IngestResult {
  logId: string;
  rawText: string;
}

export interface LogStatusResponse {
  id: string;
  status: LogStatus;
  raw_text: string | null;
  structured_data: StructuredLogData | null;
  error_message?: string | null;
}

export interface LogPatchRequest {
  raw_text?: string;
  structured_data?: StructuredLogData;
}

export interface LogSubmitResponse {
  id: string;
  status: LogStatus;
}

export interface LogCommitResponse {
  id: string;
  status: LogStatus;
}

export interface LogListItem {
  id: string;
  status: LogStatus;
  raw_text: string;
  structured_data: StructuredLogData | null;
  component_type: string | null;
  airline: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedLogsResponse {
  items: LogListItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface ListLogsParams {
  page?: number;
  pageSize?: number;
}

export function normalizeStructuredData(
  data: Partial<StructuredLogData> | null | undefined,
): StructuredLogData {
  return {
    action: data?.action ?? '',
    part_number: data?.part_number ?? '',
    reference: data?.reference ?? '',
    torque: data?.torque ?? '',
  };
}

export function isLogStructuringComplete(
  status: LogStatusResponse | undefined,
): boolean {
  return status?.status === 'draft' && status.structured_data !== null;
}

export function isLogFailed(status: LogStatusResponse | undefined): boolean {
  return status?.status === 'failed';
}

export function logStatusBadgeVariant(
  status: LogStatus,
): 'success' | 'neutral' | 'warning' | 'error' {
  if (status === 'committed') return 'success';
  if (status === 'draft') return 'warning';
  if (status === 'failed') return 'error';
  return 'neutral';
}

export function logStatusLabel(status: LogStatus): string {
  const labels: Record<LogStatus, string> = {
    transcribed: 'Transcribed',
    pending: 'Pending',
    processing: 'Processing',
    draft: 'Draft',
    committed: 'Committed',
    failed: 'Failed',
  };
  return labels[status];
}

export function validateStructuredLogForCommit(
  data: StructuredLogData,
): string | null {
  if (!data.action.trim()) return 'Action is required.';
  const keys: (keyof StructuredLogData)[] = [
    'action',
    'part_number',
    'reference',
    'torque',
  ];
  for (const key of keys) {
    if (typeof data[key] !== 'string') {
      return `Field "${key}" must be a string.`;
    }
  }
  return null;
}

function logsPath(suffix: string): string {
  return `${apiBase()}/api/logs${suffix}`;
}

function transcribePath(): string {
  return `${apiBase()}/api/transcribe`;
}

export function parseFastApiError(
  err: { error?: string; detail?: string | unknown },
  fallback: string,
): string {
  if (err.error) return err.error;
  const { detail } = err;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d: { msg?: string }) => d.msg)
      .filter(Boolean)
      .join(', ');
  }
  return fallback;
}

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { error?: string; detail?: unknown };
  if (!response.ok) {
    throw new Error(parseFastApiError(body, `Request failed (${response.status})`));
  }
  return body;
}

export async function ingestLog(
  audio: Blob,
  componentType?: string,
): Promise<IngestResult> {
  const formData = new FormData();
  const ext = audio.type.includes('webm') ? 'webm' : 'wav';
  formData.append('file', audio, `recording.${ext}`);
  if (componentType) {
    formData.append('component_type', componentType);
  }

  const response = await fetch(transcribePath(), {
    method: 'POST',
    body: formData,
  });

  if (response.status !== 202 && !response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      parseFastApiError(err, `Transcribe failed (${response.status})`),
    );
  }

  const body = (await response.json()) as TranscribeResponse;
  if (!body.log_id) {
    throw new Error('Transcribe response missing log id');
  }

  return { logId: body.log_id, rawText: body.raw_text ?? '' };
}

export async function patchLogRawText(
  logId: string,
  rawText: string,
): Promise<void> {
  const response = await fetch(logsPath(`/${logId}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw_text: rawText } satisfies LogPatchRequest),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      parseFastApiError(err, `Update failed (${response.status})`),
    );
  }
}

export async function submitLogForStructuring(logId: string): Promise<void> {
  const response = await fetch(logsPath(`/${logId}/submit`), {
    method: 'POST',
  });

  if (response.status !== 202 && !response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      parseFastApiError(err, `Submit failed (${response.status})`),
    );
  }
}

export async function getLogStatus(logId: string): Promise<LogStatusResponse> {
  const response = await fetch(logsPath(`/${logId}/status`));
  const body = await parseJson<LogStatusResponse>(response);

  if (body.structured_data) {
    body.structured_data = normalizeStructuredData(body.structured_data);
  }

  return body;
}

export async function listLogs(
  params: ListLogsParams = {},
): Promise<PaginatedLogsResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const query = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  const response = await fetch(`${logsPath('')}?${query.toString()}`);
  const body = await parseJson<PaginatedLogsResponse>(response);

  return {
    ...body,
    items: body.items.map((item) => ({
      ...item,
      structured_data: item.structured_data
        ? normalizeStructuredData(item.structured_data)
        : null,
    })),
  };
}

export async function commitLog(
  logId: string,
  structuredData: StructuredLogData,
): Promise<LogCommitResponse> {
  const validationError = validateStructuredLogForCommit(structuredData);
  if (validationError) {
    throw new Error(validationError);
  }

  const payload = normalizeStructuredData(structuredData);

  const response = await fetch(logsPath(`/${logId}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      parseFastApiError(err, `Commit failed (${response.status})`),
    );
  }

  return parseJson<LogCommitResponse>(response);
}
