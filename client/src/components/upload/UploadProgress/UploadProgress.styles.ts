import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const Label = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const Track = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.colors.tileBg};
  border-radius: ${({ theme }) => theme.radii.pill};
  overflow: hidden;
`;

export const Fill = styled.div<{ $percent: number; $indeterminate?: boolean }>`
  height: 100%;
  width: ${({ $indeterminate, $percent }) => ($indeterminate ? '40%' : `${$percent}%`)};
  background: ${({ theme }) => theme.gradients.accent};
  border-radius: ${({ theme }) => theme.radii.pill};
  transition: width 0.2s ease;
  animation: ${({ $indeterminate }) => ($indeterminate ? 'pulse 1.2s ease-in-out infinite' : 'none')};

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;
