import type { TroubleshootSummary } from '../../../services/troubleshootService';
import {
  Card,
  CardLabel,
  RecommendedAction,
  RootCauseText,
} from './RootCauseCard.styles';

interface RootCauseCardProps {
  summary: TroubleshootSummary;
}

export function RootCauseCard({ summary }: RootCauseCardProps) {
  return (
    <Card>
      <CardLabel>Root cause discovery</CardLabel>
      <RootCauseText>{summary.root_cause_discovery}</RootCauseText>
      <CardLabel>Recommended action</CardLabel>
      <RecommendedAction>{summary.recommended_action}</RecommendedAction>
    </Card>
  );
}
