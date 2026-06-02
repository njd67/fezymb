import styled from 'styled-components';

export const Field = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  &:disabled {
    opacity: 0.45;
    pointer-events: none;
  }
`;

export const Legend = styled.legend`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  padding: 0;
`;

export const BoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const BoxLabel = styled.label<{ $selected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: 0.9375rem;
  font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : theme.colors.surface};
  border: 2px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.accentStart : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentStart};
  }

  &:has(:focus-visible) {
    outline: 2px solid ${({ theme }) => theme.colors.accentStart};
    outline-offset: 2px;
  }
`;

export const Hint = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textLight};
`;
