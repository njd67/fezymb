import { Spinner } from '../../ui/Spinner';
import { LoadingBlock, LoadingLabel } from './TroubleshootLoading.styles';

export function TroubleshootLoading() {
  return (
    <LoadingBlock>
      <Spinner aria-hidden />
      <LoadingLabel>Searching historical faults…</LoadingLabel>
    </LoadingBlock>
  );
}
