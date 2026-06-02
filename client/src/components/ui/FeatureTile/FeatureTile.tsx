import { useState } from 'react';
import {
  Cta,
  Description,
  MoreInfo,
  PlusButton,
  Tile,
  TileFooter,
  Title,
} from './FeatureTile.styles';

interface FeatureTileProps {
  to: string;
  title: string;
  description: string;
  moreInfo?: string;
  cta?: string;
}

export function FeatureTile({
  to,
  title,
  description,
  moreInfo,
  cta = 'Get started →',
}: FeatureTileProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMoreInfo = Boolean(moreInfo);

  return (
    <Tile>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {hasMoreInfo && <MoreInfo $visible={expanded}>{moreInfo}</MoreInfo>}
      <TileFooter>
        <Cta to={to}>{cta}</Cta>
        {hasMoreInfo && (
          <PlusButton
            type="button"
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide details' : 'Show more details'}
            onClick={() => setExpanded((open) => !open)}
          >
            +
          </PlusButton>
        )}
      </TileFooter>
    </Tile>
  );
}
