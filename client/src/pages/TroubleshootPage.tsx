import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { TroubleshootForm } from '../components/troubleshoot/TroubleshootForm';
import { TroubleshootLayout } from '../components/troubleshoot/TroubleshootLayout';
import { TroubleshootLoading } from '../components/troubleshoot/TroubleshootLoading';
import { TroubleshootResults } from '../components/troubleshoot/TroubleshootResults';
import { useFleetDropdown } from '../hooks/troubleshoot/useFleetDropdown';
import { useTroubleshootSearch } from '../hooks/troubleshoot/useTroubleshootSearch';
import { ErrorText } from './shared/uploadPage.styles';

export function TroubleshootPage() {
  const [selectedFleetId, setSelectedFleetId] = useState('');
  const [faultDescription, setFaultDescription] = useState('');

  const fleetQuery = useFleetDropdown();
  const search = useTroubleshootSearch();

  const fleets = fleetQuery.data ?? [];

  const handleSubmit = () => {
    search.mutate({
      fleet_id: selectedFleetId,
      fault_description: faultDescription,
    });
  };

  const errorMessage =
    search.error instanceof Error ? search.error.message : fleetQuery.error instanceof Error
      ? fleetQuery.error.message
      : null;

  return (
    <PageContainer>
      <TroubleshootLayout>
        <TroubleshootForm
          fleets={fleets}
          fleetsLoading={fleetQuery.isLoading}
          selectedFleetId={selectedFleetId}
          onFleetChange={setSelectedFleetId}
          faultDescription={faultDescription}
          onFaultDescriptionChange={setFaultDescription}
          onSubmit={handleSubmit}
          isPending={search.isPending}
        />
        {search.isPending && <TroubleshootLoading />}
        {search.data && !search.isPending && <TroubleshootResults data={search.data} />}
        {errorMessage && !search.isPending && <ErrorText>{errorMessage}</ErrorText>}
      </TroubleshootLayout>
    </PageContainer>
  );
}
