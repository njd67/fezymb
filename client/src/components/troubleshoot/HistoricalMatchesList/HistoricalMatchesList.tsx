import { formatDuration, type HistoricalMatch } from '../../../services/troubleshootService';
import {
  EmptyMatches,
  MatchAction,
  MatchDuration,
  MatchItem,
  MatchList,
  MatchesCard,
  MatchesTitle,
} from './HistoricalMatchesList.styles';

interface HistoricalMatchesListProps {
  matches: HistoricalMatch[];
}

export function HistoricalMatchesList({ matches }: HistoricalMatchesListProps) {
  return (
    <MatchesCard>
      <MatchesTitle>Historical matches</MatchesTitle>
      {matches.length === 0 ? (
        <EmptyMatches>No similar faults found in maintenance history.</EmptyMatches>
      ) : (
        <MatchList>
          {matches.map((match) => (
            <MatchItem key={match.id}>
              <MatchAction>{match.action_taken}</MatchAction>
              <MatchDuration>{formatDuration(match.labor_minutes)} labor</MatchDuration>
            </MatchItem>
          ))}
        </MatchList>
      )}
    </MatchesCard>
  );
}
