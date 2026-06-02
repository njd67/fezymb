import { useMutation } from '@tanstack/react-query';
import { ingestLog } from '../../services/logService';

export interface IngestLogVariables {
  audio: Blob;
  componentType?: string;
}

export function useIngestLog() {
  return useMutation({
    mutationFn: ({ audio, componentType }: IngestLogVariables) =>
      ingestLog(audio, componentType),
  });
}
