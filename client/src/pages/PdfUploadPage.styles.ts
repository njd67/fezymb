import styled from 'styled-components';

export const ReviewList = styled.ul`
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.sm} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.875rem;
  }
`;

export const Meta = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
