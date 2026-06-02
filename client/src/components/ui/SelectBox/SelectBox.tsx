import type { SelectOption } from './selectTypes';
import { BoxGrid, BoxLabel, Field, HiddenRadio, Hint, Legend } from './SelectBox.styles';

export type { SelectOption };

interface SelectBoxProps {
  label: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  disabled?: boolean;
}

export function SelectBox({
  label,
  name,
  options,
  value,
  onChange,
  hint,
  disabled,
}: SelectBoxProps) {
  return (
    <Field disabled={disabled}>
      <Legend>{label}</Legend>
      {hint && <Hint>{hint}</Hint>}
      <BoxGrid role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const selected = value === opt.value;
          const id = `${name}-${opt.value}`;
          return (
            <BoxLabel key={opt.value} htmlFor={id} $selected={selected}>
              <HiddenRadio
                id={id}
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
              />
              {opt.label}
            </BoxLabel>
          );
        })}
      </BoxGrid>
    </Field>
  );
}
