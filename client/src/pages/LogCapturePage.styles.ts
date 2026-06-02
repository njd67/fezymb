import styled from 'styled-components';

export const Card = styled.section`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xxxl};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const CardCopy = styled.p`
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 52ch;
`;

export const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;
`;
