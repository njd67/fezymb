import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { LogCaptureModal } from '../components/logs/LogCaptureModal';
import { LogList } from '../components/logs/LogList';
import { PageHeader } from '../components/typography/PageHeader';
import { Button } from '../components/ui/Button';
import { logQueryKeys } from '../hooks/logs/logQueryKeys';
import { Card, CardCopy, PageLayout } from './LogCapturePage.styles';

export function LogCapturePage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
    queryClient.invalidateQueries({ queryKey: logQueryKeys.all });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Maintenance"
        gradientPhrase="log capture"
        tight
        subtitle="Record voice notes, review AI-structured fields, and commit to the ledger."
        subtext="Review and edit the unstructured transcript, submit for structuring, then save and commit the draft fields."
      />

      <PageLayout>
        <Card>
          <CardCopy>Capture a maintenance log from your microphone.</CardCopy>
        </Card>

        <LogList
          headerAction={
            <Button variant="primary" compact onClick={() => setModalOpen(true)}>
              Start log capture
            </Button>
          }
        />
      </PageLayout>

      <LogCaptureModal open={modalOpen} onClose={handleModalClose} />
    </PageContainer>
  );
}
