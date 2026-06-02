import styled from 'styled-components';

export const Section = styled.fieldset<{ $disabled: boolean }>`
  border: none;
  padding: 0;
  margin: 0;
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  transition: opacity 0.2s ease;

  &:not(:last-of-type) {
    padding-bottom: ${({ theme }) => theme.spacing.xxl};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const StepMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const StepNumber = styled.span<{ $done: boolean; $active: boolean }>`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.8125rem;
  font-weight: 700;
  background: ${({ theme, $done, $active }) => {
    if ($done) return theme.colors.success;
    if ($active) return theme.colors.accentStart;
    return theme.colors.stepMuted;
  }};
  color: ${({ theme, $done, $active }) =>
    $done || $active ? theme.colors.primaryText : theme.colors.textMuted};
`;

export const StepTitles = styled.div`
  flex: 1;
`;

export const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const Body = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;
