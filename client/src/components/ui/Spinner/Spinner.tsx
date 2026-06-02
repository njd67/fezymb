import { HTMLAttributes } from 'react';
import { SpinnerRing } from './Spinner.styles';

export function Spinner(props: HTMLAttributes<HTMLDivElement>) {
  return <SpinnerRing {...props} />;
}
