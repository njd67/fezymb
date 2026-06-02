import { formatDuration } from '../../../services/troubleshootService';
import { BadgeWrap, ComparisonBadge, FixTimeLabel } from './FixTimeComparisonBadge.styles';

interface FixTimeComparisonBadgeProps {
  estimatedMins: number;
  historicalAverageMins: number;
}

export function FixTimeComparisonBadge({
  estimatedMins,
  historicalAverageMins,
}: FixTimeComparisonBadgeProps) {
  const estimated = formatDuration(estimatedMins);
  const historical = formatDuration(historicalAverageMins);

  return (
    <BadgeWrap>
      <div>
        <FixTimeLabel>Fix time</FixTimeLabel>
        <ComparisonBadge>
          {estimated} vs {historical} historical average
        </ComparisonBadge>
      </div>
    </BadgeWrap>
  );
}
