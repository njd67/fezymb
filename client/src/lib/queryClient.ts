import { QueryClient } from '@tanstack/react-query';

export const LOG_STATUS_POLL_MS = 2000;
export const LOG_STATUS_MAX_POLLS = 60;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
