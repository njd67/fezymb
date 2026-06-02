import { ButtonHTMLAttributes } from 'react';
import { ButtonVariant, StyledButton } from './Button.styles';

export type { ButtonVariant };

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  compact?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth,
  compact,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $fullWidth={fullWidth} $compact={compact} {...props}>
      {children}
    </StyledButton>
  );
}
