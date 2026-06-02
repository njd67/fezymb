import { ReactNode, useState } from 'react';
import { SectionHeader } from '../../typography/SectionHeader';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { useLogList } from '../../../hooks/logs/useLogList';
import {
  logStatusBadgeVariant,
  logStatusLabel,
  type LogListItem,
} from '../../../services/logService';
import {
  EmptyState,
  ErrorState,
  ItemHeader,
  ItemMeta,
  ItemPreview,
  ItemTitle,
  List,
  ListItem,
  PageInfo,
  Pagination,
  PaginationActions,
  Section,
} from './LogList.styles';

const PAGE_SIZE = 10;

function formatLogDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

function formatComponentType(value: string | null): string | null {
  if (!value) return null;
  return value.replace(/_/g, ' ');
}

function getLogTitle(log: LogListItem): string {
  const action = log.structured_data?.action?.trim();
  if (action) return action;
  return log.raw_text.trim() || 'Untitled log';
}

function getLogPreview(log: LogListItem): string | null {
  const action = log.structured_data?.action?.trim();
  if (action && log.raw_text.trim()) {
    return log.raw_text.trim();
  }
  return null;
}

export function LogList({ headerAction }: { headerAction?: ReactNode }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, isFetching } = useLogList({
    page,
    pageSize: PAGE_SIZE,
  });

  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 1;
  const total = data?.total ?? 0;

  return (
    <Section>
      <SectionHeader
        title="Recent logs"
        tight
        subtitle={
          total > 0
            ? `${total} log${total === 1 ? '' : 's'} in the ledger`
            : 'Committed and in-progress logs appear here.'
        }
        badge={headerAction}
      />

      {isLoading && <EmptyState>Loading logs…</EmptyState>}

      {isError && (
        <ErrorState>
          {error instanceof Error ? error.message : 'Failed to load logs'}
        </ErrorState>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState>No logs yet. Capture your first maintenance log to get started.</EmptyState>
      )}

      {!isLoading && !isError && items.length > 0 && (
        <>
          <List>
            {items.map((log) => {
              const preview = getLogPreview(log);
              const component = formatComponentType(log.component_type);
              const metaParts = [component, formatLogDate(log.created_at)].filter(Boolean);

              return (
                <ListItem key={log.id}>
                  <ItemHeader>
                    <ItemTitle>{getLogTitle(log)}</ItemTitle>
                    <StatusBadge variant={logStatusBadgeVariant(log.status)}>
                      {logStatusLabel(log.status)}
                    </StatusBadge>
                  </ItemHeader>
                  <ItemMeta>{metaParts.join(' · ')}</ItemMeta>
                  {preview && <ItemPreview>{preview}</ItemPreview>}
                  {log.status === 'failed' && log.error_message && (
                    <ItemPreview>{log.error_message}</ItemPreview>
                  )}
                </ListItem>
              );
            })}
          </List>

          {totalPages > 1 && (
            <Pagination>
              <PageInfo>
                Page {page} of {totalPages}
                {isFetching ? ' · Updating…' : ''}
              </PageInfo>
              <PaginationActions>
                <Button
                  variant="secondary"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || isFetching}
                  fullWidth
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page >= totalPages || isFetching}
                  fullWidth
                >
                  Next
                </Button>
              </PaginationActions>
            </Pagination>
          )}
        </>
      )}
    </Section>
  );
}
