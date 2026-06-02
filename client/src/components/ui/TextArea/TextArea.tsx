import { TextareaHTMLAttributes } from 'react';
import { Field, Hint, Label, StyledTextArea } from './TextArea.styles';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function TextArea({ label, hint, id, ...props }: TextAreaProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <Field>
      <Label htmlFor={fieldId}>{label}</Label>
      {hint && <Hint>{hint}</Hint>}
      <StyledTextArea id={fieldId} {...props} />
    </Field>
  );
}
