import { ReactNode } from 'react';
import { GradientText, Subtext, Subtitle, Title, Wrapper } from './PageHeader.styles';

interface PageHeaderProps {
  title: ReactNode;
  gradientPhrase?: string;
  gradientTone?: 'accent' | 'purple';
  subtitle?: string;
  subtext?: string;
  tight?: boolean;
}

export function PageHeader({
  title,
  gradientPhrase,
  gradientTone = 'accent',
  subtitle,
  subtext,
  tight,
}: PageHeaderProps) {
  return (
    <Wrapper $tight={tight}>
      <Title>
        {title}
        {gradientPhrase && (
          <>
            {' '}
            <GradientText $tone={gradientTone}>{gradientPhrase}</GradientText>
          </>
        )}
      </Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {subtext && <Subtext>{subtext}</Subtext>}
    </Wrapper>
  );
}
