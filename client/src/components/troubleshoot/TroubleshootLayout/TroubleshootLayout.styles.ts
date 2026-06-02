import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const Sidebar = styled.aside`
  flex: 0 0 220px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.tileBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex: none;
    width: 100%;
  }
`;

export const SidebarTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const SidebarItem = styled.span<{ $active?: boolean; $disabled?: boolean }>`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.9375rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ theme, $active, $disabled }) => {
    if ($disabled) return theme.colors.textLight;
    if ($active) return theme.colors.text;
    return theme.colors.textMuted;
  }};
  background: ${({ theme, $active }) => ($active ? theme.colors.surface : 'transparent')};
  border-radius: ${({ theme }) => theme.radii.md};
  border-left: 3px solid
    ${({ theme, $active }) => ($active ? theme.colors.accentStart : 'transparent')};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

export const Main = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

export const MainTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

export const MainSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 52ch;
`;
