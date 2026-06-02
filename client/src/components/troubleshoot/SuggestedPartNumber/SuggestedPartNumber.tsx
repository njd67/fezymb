import { PartCard, PartLabel, PartNumber } from './SuggestedPartNumber.styles';

interface SuggestedPartNumberProps {
  partNumber: string;
}

export function SuggestedPartNumber({ partNumber }: SuggestedPartNumberProps) {
  return (
    <PartCard>
      <PartLabel>Suggested part number</PartLabel>
      <PartNumber>{partNumber}</PartNumber>
    </PartCard>
  );
}
