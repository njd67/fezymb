import { Fill, Label, Track, Wrapper } from './UploadProgress.styles';

interface UploadProgressProps {
  percent: number;
  indeterminate?: boolean;
  label?: string;
}

export function UploadProgress({
  percent,
  indeterminate,
  label = 'Uploading',
}: UploadProgressProps) {
  return (
    <Wrapper>
      <Label>
        <span>{label}</span>
        {!indeterminate && <span>{Math.round(percent)}%</span>}
      </Label>
      <Track>
        <Fill $percent={percent} $indeterminate={indeterminate} />
      </Track>
    </Wrapper>
  );
}
