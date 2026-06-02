import styled from 'styled-components';

export type BadgeVariant = 'success' | 'neutral' | 'warning' | 'error';

export const Badge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $variant }) => {
    if ($variant === 'success') return theme.colors.successBg;
    if ($variant === 'warning') return '#FEF3C7';
    if ($variant === 'error') return theme.colors.errorBg;
    return theme.colors.tileBg;
  }};
  color: ${({ theme, $variant }) => {
    if ($variant === 'success') return theme.colors.success;
    if ($variant === 'warning') return '#B45309';
    if ($variant === 'error') return theme.colors.error;
    return theme.colors.textMuted;
  }};
`;
