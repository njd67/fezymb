import { Button } from '../../ui/Button';
import { SelectField } from '../../ui/SelectField';
import { TextArea } from '../../ui/TextArea';
import { FormCard, FormFields } from './TroubleshootForm.styles';
import type { FleetDropdownItem } from '../../../services/troubleshootService';

interface TroubleshootFormProps {
  fleets: FleetDropdownItem[];
  fleetsLoading: boolean;
  selectedFleetId: string;
  onFleetChange: (fleetId: string) => void;
  faultDescription: string;
  onFaultDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function TroubleshootForm({
  fleets,
  fleetsLoading,
  selectedFleetId,
  onFleetChange,
  faultDescription,
  onFaultDescriptionChange,
  onSubmit,
  isPending,
}: TroubleshootFormProps) {
  const fleetOptions = fleets.map((f) => ({
    value: f.id,
    label: f.tail_number,
  }));

  const canSubmit =
    !isPending && !fleetsLoading && selectedFleetId && faultDescription.trim().length > 0;

  return (
    <FormCard>
      <FormFields>
        <SelectField
          label="Aircraft"
          hint="Select the tail number for this fault report."
          options={fleetOptions}
          placeholder={fleetsLoading ? 'Loading fleet…' : 'Select aircraft'}
          value={selectedFleetId}
          onChange={onFleetChange}
          disabled={fleetsLoading || isPending}
        />
        <TextArea
          label="Fault description"
          hint="Describe the fault or paste a voice transcript."
          value={faultDescription}
          onChange={(e) => onFaultDescriptionChange(e.target.value)}
          placeholder="e.g. Transponder intermittent on climb, no fault code displayed…"
          rows={5}
          disabled={isPending}
        />
      </FormFields>
      <Button variant="primary" onClick={onSubmit} disabled={!canSubmit} fullWidth>
        Run AI search
      </Button>
    </FormCard>
  );
}
