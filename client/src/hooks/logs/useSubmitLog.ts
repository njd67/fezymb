import { useMutation } from '@tanstack/react-query';
import {
  patchLogRawText,
  submitLogForStructuring,
} from '../../services/logService';

export interface SubmitLogVariables {
  logId: string;
  rawText: string;
}

export function useSubmitLog() {
  return useMutation({
    mutationFn: async ({ logId, rawText }: SubmitLogVariables) => {
      await patchLogRawText(logId, rawText);
      await submitLogForStructuring(logId);
    },
  });
}
