export const troubleshootQueryKeys = {
  all: ['troubleshoot'] as const,
  fleetDropdown: () => [...troubleshootQueryKeys.all, 'fleetDropdown'] as const,
};
