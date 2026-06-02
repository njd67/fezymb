import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LOG_STATUS_POLL_MS,
  LOG_STATUS_MAX_POLLS,
} from '../../lib/queryClient';
import {
  getLogStatus,
  isLogFailed,
  isLogStructuringComplete,
  type LogStatusResponse,
} from '../../services/logService';
import { logQueryKeys } from './logQueryKeys';

const statusFetchCounts = new Map<string, number>();

export function resetLogStatusPollCount(logId: string): void {
  statusFetchCounts.delete(logId);
}

interface UseLogStatusOptions {
  logId: string | null;
  enabled?: boolean;
}

export function useLogStatus({ logId, enabled = true }: UseLogStatusOptions) {
  useEffect(() => {
    if (logId) statusFetchCounts.set(logId, 0);
  }, [logId]);

  return useQuery({
    queryKey: logQueryKeys.status(logId ?? ''),
    queryFn: async (): Promise<LogStatusResponse> => {
      const count = (statusFetchCounts.get(logId!) ?? 0) + 1;
      statusFetchCounts.set(logId!, count);

      const status = await getLogStatus(logId!);

      if (count >= LOG_STATUS_MAX_POLLS && !isLogStructuringComplete(status) && !isLogFailed(status)) {
        throw new Error('Timed out waiting for structured log data');
      }

      return status;
    },
    enabled: enabled && !!logId,
    staleTime: LOG_STATUS_POLL_MS,
    refetchOnMount: enabled ? 'always' : false,
    refetchInterval: (query) => {
      if (!enabled) return false;
      const data = query.state.data;
      if (isLogStructuringComplete(data)) return false;
      if (isLogFailed(data)) return false;
      if (query.state.error) return false;
      return LOG_STATUS_POLL_MS;
    },
  });
}

export function getLogStatusErrorMessage(error: unknown): string | null {
  if (!error) return null;
  return error instanceof Error ? error.message : 'Status check failed';
}
