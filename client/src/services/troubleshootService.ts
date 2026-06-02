import { parseFastApiError } from './logService';

export interface FleetDropdownItem {
  id: string;
  tail_number: string;
}

export interface TroubleshootRequest {
  fleet_id: string;
  fault_description: string;
}

export interface TroubleshootSummary {
  root_cause_discovery: string;
  recommended_action: string;
  estimated_fix_time_mins: number;
  historical_average_mins: number;
  suggested_part_number: string;
}

export interface HistoricalMatch {
  id: string;
  action_taken: string;
  labor_minutes: number;
}

export interface TroubleshootResponse {
  summary: TroubleshootSummary;
  historical_matches: HistoricalMatch[];
}

function apiBase(): string {
  return '';
}

function fleetsPath(): string {
  return `${apiBase()}/api/fleets/dropdown`;
}

function troubleshootPath(): string {
  return `${apiBase()}/api/troubleshoot`;
}

export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} mins`;
  const hours = mins / 60;
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { error?: string; detail?: unknown };
  if (!response.ok) {
    throw new Error(parseFastApiError(body, `Request failed (${response.status})`));
  }
  return body;
}

interface FleetDropdownResponse {
  items: FleetDropdownItem[];
}

export async function getFleetDropdown(): Promise<FleetDropdownItem[]> {
  const response = await fetch(fleetsPath());
  const body = await parseJson<FleetDropdownResponse>(response);
  return body.items;
}

export function validateTroubleshootRequest(body: TroubleshootRequest): string | null {
  if (!body.fleet_id.trim()) return 'Please select an aircraft.';
  if (!body.fault_description.trim()) return 'Please describe the fault.';
  return null;
}

export async function runTroubleshoot(body: TroubleshootRequest): Promise<TroubleshootResponse> {
  const validationError = validateTroubleshootRequest(body);
  if (validationError) throw new Error(validationError);

  const response = await fetch(troubleshootPath(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fleet_id: body.fleet_id.trim(),
      fault_description: body.fault_description.trim(),
    }),
  });

  return parseJson<TroubleshootResponse>(response);
}
