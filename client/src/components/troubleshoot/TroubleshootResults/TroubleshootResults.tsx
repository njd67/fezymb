import type { TroubleshootResponse } from '../../../services/troubleshootService';
import { FixTimeComparisonBadge } from '../FixTimeComparisonBadge';
import { HistoricalMatchesList } from '../HistoricalMatchesList';
import { RootCauseCard } from '../RootCauseCard';
import { SuggestedPartNumber } from '../SuggestedPartNumber';
import { MetricsRow, ResultsStack } from './TroubleshootResults.styles';

interface TroubleshootResultsProps {
  data: TroubleshootResponse;
}

export function TroubleshootResults({ data }: TroubleshootResultsProps) {
  const { summary, historical_matches } = data;

  return (
    <ResultsStack>
      <RootCauseCard summary={summary} />
      <MetricsRow>
        <SuggestedPartNumber partNumber={summary.suggested_part_number} />
        <FixTimeComparisonBadge
          estimatedMins={summary.estimated_fix_time_mins}
          historicalAverageMins={summary.historical_average_mins}
        />
      </MetricsRow>
      <HistoricalMatchesList matches={historical_matches} />
    </ResultsStack>
  );
}
