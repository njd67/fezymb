import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commitLog, type StructuredLogData } from '../../services/logService';
import { logQueryKeys } from './logQueryKeys';

export interface CommitLogVariables {
  logId: string;
  structuredData: StructuredLogData;
}

export function useCommitLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ logId, structuredData }: CommitLogVariables) =>
      commitLog(logId, structuredData),
    onSuccess: (_data, { logId }) => {
      queryClient.removeQueries({ queryKey: logQueryKeys.status(logId) });
      queryClient.invalidateQueries({ queryKey: logQueryKeys.all });
    },
  });
}
