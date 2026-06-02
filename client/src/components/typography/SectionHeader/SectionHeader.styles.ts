import styled from 'styled-components';

export const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const BadgeSlot = styled.div`
  flex-shrink: 0;
`;

export const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

export const Subtitle = styled.p<{ $tight?: boolean }>`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0
    ${({ theme, $tight }) => ($tight ? theme.spacing.sm : theme.spacing.md)};
`;
