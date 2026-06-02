import { ReactNode } from 'react';
import {
  Layout,
  Main,
  MainSubtitle,
  MainTitle,
  Sidebar,
  SidebarItem,
  SidebarTitle,
} from './TroubleshootLayout.styles';

const SIDEBAR_ITEMS: {
  id: string;
  label: string;
  active: boolean;
  disabled?: boolean;
}[] = [
  { id: 'troubleshoot', label: 'Troubleshoot', active: true },
  { id: 'work-orders', label: 'Work orders', active: false, disabled: true },
  { id: 'fleet-health', label: 'Fleet health', active: false, disabled: true },
];

interface TroubleshootLayoutProps {
  children: ReactNode;
}

export function TroubleshootLayout({ children }: TroubleshootLayoutProps) {
  return (
    <Layout>
      <Sidebar>
        <SidebarTitle>Dashboard</SidebarTitle>
        {SIDEBAR_ITEMS.map(({ id, label, active, disabled }) => (
          <SidebarItem key={id} $active={active} $disabled={disabled}>
            {label}
          </SidebarItem>
        ))}
      </Sidebar>
      <Main>
        <div>
          <MainTitle>Troubleshoot</MainTitle>
          <MainSubtitle>
            Describe a fault and search historical maintenance records for root-cause
            insights and recommended actions.
          </MainSubtitle>
        </div>
        {children}
      </Main>
    </Layout>
  );
}
