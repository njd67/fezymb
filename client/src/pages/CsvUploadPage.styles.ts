import styled from 'styled-components';

export const ReviewList = styled.dl`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};

  dt {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  dd {
    font-size: 1rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;
