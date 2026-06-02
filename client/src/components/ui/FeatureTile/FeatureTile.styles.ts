import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Tile = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.purpleBorder};
  }
`;

export const TileFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const PlusButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    opacity 0.25s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.purpleBorder};
    color: ${({ theme }) => theme.colors.purpleBorder};
  }

  &[aria-expanded='true'] {
    opacity: 0.45;
  }
`;

export const Title = styled.h3`
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const Description = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  flex: 1;
`;

export const MoreInfo = styled.p<{ $visible: boolean }>`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  max-height: ${({ $visible }) => ($visible ? '12rem' : '0')};
  overflow: hidden;
  transition:
    opacity 0.35s ease,
    max-height 0.35s ease;
`;

export const Cta = styled(Link)`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;
