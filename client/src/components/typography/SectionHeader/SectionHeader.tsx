import { ReactNode } from 'react';
import { BadgeSlot, HeaderBlock, HeaderRow, Subtitle, Title } from './SectionHeader.styles';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  tight?: boolean;
}

export function SectionHeader({ title, subtitle, badge, tight }: SectionHeaderProps) {
  return (
    <HeaderBlock>
      <HeaderRow>
        <Title>{title}</Title>
        {badge && <BadgeSlot>{badge}</BadgeSlot>}
      </HeaderRow>
      {subtitle && <Subtitle $tight={tight}>{subtitle}</Subtitle>}
    </HeaderBlock>
  );
}
