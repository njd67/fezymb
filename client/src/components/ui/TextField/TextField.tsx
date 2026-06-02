import { InputHTMLAttributes } from 'react';
import { Field, Hint, Label, StyledInput } from './TextField.styles';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  fieldKey: string;
  hint?: string;
}

function formatFieldLabel(key: string): string {
  return key.replace(/_/g, ' ');
}

export function TextField({ label, fieldKey, hint, id, ...props }: TextFieldProps) {
  const fieldId = id ?? `field-${fieldKey}`;
  const displayLabel = label || formatFieldLabel(fieldKey);

  return (
    <Field>
      <Label htmlFor={fieldId}>{displayLabel}</Label>
      {hint && <Hint>{hint}</Hint>}
      <StyledInput id={fieldId} name={fieldKey} {...props} />
    </Field>
  );
}
