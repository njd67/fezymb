import { ReactNode } from 'react';
import { Body, Section, StepMeta, StepNumber, StepTitles, Title } from './UploadStepSection.styles';

interface UploadStepSectionProps {
  stepNumber: number;
  title: string;
  body: string;
  disabled: boolean;
  done: boolean;
  active: boolean;
  children: ReactNode;
}

export function UploadStepSection({
  stepNumber,
  title,
  body,
  disabled,
  done,
  active,
  children,
}: UploadStepSectionProps) {
  return (
    <Section $disabled={disabled} aria-disabled={disabled}>
      <StepMeta>
        <StepNumber $done={done} $active={active}>
          {done ? '✓' : stepNumber}
        </StepNumber>
        <StepTitles>
          <Title>{title}</Title>
          <Body>{body}</Body>
        </StepTitles>
      </StepMeta>
      {children}
    </Section>
  );
}
