import { useQuery } from '@tanstack/react-query';
import { getFleetDropdown } from '../../services/troubleshootService';
import { troubleshootQueryKeys } from './troubleshootQueryKeys';

export function useFleetDropdown() {
  return useQuery({
    queryKey: troubleshootQueryKeys.fleetDropdown(),
    queryFn: getFleetDropdown,
    staleTime: 5 * 60_000,
  });
}
