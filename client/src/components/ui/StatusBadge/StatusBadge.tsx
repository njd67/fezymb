import { Badge, BadgeVariant } from './StatusBadge.styles';

export type { BadgeVariant };

interface StatusBadgeProps {
  children: string;
  variant?: BadgeVariant;
}

export function StatusBadge({ children, variant = 'neutral' }: StatusBadgeProps) {
  return <Badge $variant={variant}>{children}</Badge>;
}
