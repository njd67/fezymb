import styled from 'styled-components';

export const Zone = styled.div<{ $dragging: boolean; $hasError: boolean; $disabled?: boolean }>`
  border: 2px dashed
    ${({ theme, $dragging, $hasError }) => {
      if ($hasError) return theme.colors.error;
      if ($dragging) return theme.colors.text;
      return theme.colors.border;
    }};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.xxxl} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  background: ${({ theme, $dragging }) =>
    $dragging ? theme.colors.tileBg : theme.colors.background};
  transition: border-color 0.15s ease, background 0.15s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${({ theme, $disabled }) => ($disabled ? undefined : theme.colors.textMuted)};
  }
`;

export const ZoneTitle = styled.p`
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const ZoneHint = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const FileList = styled.ul`
  list-style: none;
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: left;
`;

export const FileItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.875rem;

  &:last-child {
    border-bottom: none;
  }
`;

export const ErrorText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.error};
`;

export const HiddenInput = styled.input`
  display: none;
`;
