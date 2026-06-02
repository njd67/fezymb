import styled from 'styled-components';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(26, 26, 26, 0.45);
`;

export const Panel = styled.div<{ $wide?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ $wide }) => ($wide ? '960px' : '720px')};
  height: ${({ $wide }) => ($wide ? '490px' : 'auto')};
  max-height: ${({ $wide }) => ($wide ? '90vh' : 'min(520px, 90vh)')};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
  overflow: hidden;
`;

export const ProgressTrack = styled.div`
  flex-shrink: 0;
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
`;

export const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => `${Math.min(100, Math.max(0, $percent))}%`};
  background: ${({ theme }) => theme.gradients.accent};
  transition: width 0.35s ease;
`;

export const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  font-size: 1.25rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.tileBg};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const Body = styled.div<{ $flush?: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme, $flush }) => ($flush ? '0' : theme.spacing.xl)};
  min-height: 0;
  display: ${({ $flush }) => ($flush ? 'flex' : 'block')};
  flex-direction: column;
`;
