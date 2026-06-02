export const logQueryKeys = {
  all: ['logs'] as const,
  list: (page: number, pageSize: number) =>
    [...logQueryKeys.all, 'list', page, pageSize] as const,
  status: (logId: string) => [...logQueryKeys.all, 'status', logId] as const,
};
