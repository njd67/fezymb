import styled from 'styled-components';

export const Wrapper = styled.header<{ $tight?: boolean }>`
  margin-bottom: ${({ theme, $tight }) =>
    $tight ? theme.spacing.lg : theme.spacing.xxl};
`;

export const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const GradientText = styled.span<{ $tone?: 'accent' | 'purple' }>`
  background: ${({ theme, $tone }) =>
    $tone === 'purple' ? theme.gradients.purple : theme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  max-width: 36rem;
`;

export const Subtext = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 40rem;
  line-height: 1.6;
`;
