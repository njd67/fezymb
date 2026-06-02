import { Field, Hint, Label, Select } from './MicDeviceSelect.styles';

export interface MicDevice {
  deviceId: string;
  label: string;
}

interface MicDeviceSelectProps {
  devices: MicDevice[];
  value: string;
  onChange: (deviceId: string) => void;
  disabled?: boolean;
  hint?: string;
}

export function MicDeviceSelect({
  devices,
  value,
  onChange,
  disabled,
  hint,
}: MicDeviceSelectProps) {
  return (
    <Field>
      <Label htmlFor="mic-device">Microphone</Label>
      {hint && <Hint>{hint}</Hint>}
      <Select
        id="mic-device"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || devices.length === 0}
      >
        {devices.length === 0 ? (
          <option value="">No microphones found</option>
        ) : (
          devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
            </option>
          ))
        )}
      </Select>
    </Field>
  );
}
