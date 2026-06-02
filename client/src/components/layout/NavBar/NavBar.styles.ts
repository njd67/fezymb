import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.colors.navBorder};
  background: ${({ theme }) => theme.colors.navGlass};
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  box-shadow: ${({ theme }) => theme.shadows.nav};
`;

export const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  width: 100%;
  height: ${({ theme }) => theme.layout.navHeight};
  padding: 0 ${({ theme }) => theme.spacing.xxxl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
    flex-wrap: wrap;
    height: auto;
    gap: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.md};
    padding-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
`;

export const LogoMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.gradients.purple};
  color: white;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: 700;
  font-size: 1rem;
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const SolutionsMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: ${({ theme }) => theme.spacing.sm};
  }
`;

export const SolutionsTrigger = styled.span<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 2.25rem;
  cursor: default;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1;
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};
  transition: color 0.15s ease;

  ${SolutionsMenu}:hover & {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const SolutionsPanel = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.sm});
  right: 0;
  min-width: 12rem;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.purpleBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-4px);
  transition:
    opacity 0.15s ease,
    visibility 0.15s ease,
    transform 0.15s ease;

  ${SolutionsMenu}:hover &,
  ${SolutionsMenu}:focus-within & {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
  }
`;

export const SolutionsLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};
  border-radius: ${({ theme }) => theme.radii.sm};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const NavCtaGroup = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${({ theme }) => theme.spacing.xl};
  border-left: 1px solid ${({ theme }) => theme.colors.navBorder};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-left: ${({ theme }) => theme.spacing.md};
  }
`;

export const GetStartedLink = styled(Link)<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 2.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.gradients.purple};
  color: white;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;
