import { ReactNode } from 'react';
import { FormColumn, Layout, StepsStack } from './GuidedUploadLayout.styles';

interface GuidedUploadLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
}

export function GuidedUploadLayout({ children, footer }: GuidedUploadLayoutProps) {
  return (
    <Layout>
      <FormColumn>
        <StepsStack>{children}</StepsStack>
        {footer}
      </FormColumn>
    </Layout>
  );
}
