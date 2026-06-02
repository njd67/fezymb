import { SelectHTMLAttributes } from 'react';
import { Field, Hint, Label, StyledSelect } from './SelectField.styles';

export interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  hint?: string;
  options: SelectFieldOption[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SelectField({
  label,
  hint,
  options,
  placeholder,
  value,
  onChange,
  id,
  disabled,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <Field>
      <Label htmlFor={fieldId}>{label}</Label>
      {hint && <Hint>{hint}</Hint>}
      <StyledSelect
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={!value}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </StyledSelect>
    </Field>
  );
}
