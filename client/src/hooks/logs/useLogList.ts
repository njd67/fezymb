import { useQuery } from '@tanstack/react-query';
import { listLogs, type ListLogsParams } from '../../services/logService';
import { logQueryKeys } from './logQueryKeys';

interface UseLogListOptions extends ListLogsParams {
  enabled?: boolean;
}

export function useLogList({
  page = 1,
  pageSize = 10,
  enabled = true,
}: UseLogListOptions = {}) {
  return useQuery({
    queryKey: logQueryKeys.list(page, pageSize),
    queryFn: () => listLogs({ page, pageSize }),
    enabled,
  });
}
