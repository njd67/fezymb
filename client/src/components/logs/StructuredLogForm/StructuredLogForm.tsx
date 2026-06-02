import { useEffect, useState } from 'react';
import type { StructuredLogData } from '../../../services/logService';
import { normalizeStructuredData } from '../../../services/logService';
import { TextField } from '../../ui/TextField';
import { Form, FormTitle } from './StructuredLogForm.styles';

const STRUCTURED_FIELDS: {
  key: keyof StructuredLogData;
  label: string;
  hint?: string;
}[] = [
  { key: 'action', label: 'Action' },
  {
    key: 'part_number',
    label: 'Part number',
    hint: 'Leave empty if not applicable.',
  },
  {
    key: 'reference',
    label: 'Reference',
    hint: 'Manual reference (AMM/IPC/SRM). Leave empty if not applicable.',
  },
  {
    key: 'torque',
    label: 'Torque',
    hint: 'Include units if applicable. Leave empty if not applicable.',
  },
];

interface StructuredLogFormProps {
  data: StructuredLogData;
  onChange: (data: StructuredLogData) => void;
  disabled?: boolean;
}

export function StructuredLogForm({ data, onChange, disabled }: StructuredLogFormProps) {
  const [local, setLocal] = useState<StructuredLogData>(() => normalizeStructuredData(data));

  useEffect(() => {
    setLocal(normalizeStructuredData(data));
  }, [data]);

  const handleChange = (key: keyof StructuredLogData, value: string) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    onChange(next);
  };

  return (
    <Form>
      <FormTitle>Structured log fields</FormTitle>
      {STRUCTURED_FIELDS.map(({ key, label, hint }) => (
        <TextField
          key={key}
          fieldKey={key}
          label={label}
          hint={hint}
          value={local[key]}
          onChange={(e) => handleChange(key, e.target.value)}
          disabled={disabled}
        />
      ))}
    </Form>
  );
}
