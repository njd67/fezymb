import { useMutation } from '@tanstack/react-query';
import {
  runTroubleshoot,
  type TroubleshootRequest,
} from '../../services/troubleshootService';

export function useTroubleshootSearch() {
  return useMutation({
    mutationFn: (body: TroubleshootRequest) => runTroubleshoot(body),
  });
}
