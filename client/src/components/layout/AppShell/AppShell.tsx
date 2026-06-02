import { ReactNode } from 'react';
import { NavBar } from '../NavBar';
import { Content, Shell } from './AppShell.styles';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Shell>
      <NavBar />
      <Content>{children}</Content>
    </Shell>
  );
}
