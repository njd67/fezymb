import { Button } from '../../ui/Button';
import { Nav } from './StepNavigation.styles';

interface StepNavigationProps {
  isFirst: boolean;
  isLast: boolean;
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  loading?: boolean;
}

export function StepNavigation({
  isFirst,
  isLast,
  canAdvance,
  onBack,
  onNext,
  nextLabel,
  loading,
}: StepNavigationProps) {
  return (
    <Nav>
      <Button variant="secondary" onClick={onBack} disabled={isFirst || loading}>
        Back
      </Button>
      <Button onClick={onNext} disabled={!canAdvance || loading}>
        {loading ? 'Uploading…' : nextLabel ?? (isLast ? 'Finish' : 'Continue →')}
      </Button>
    </Nav>
  );
}
