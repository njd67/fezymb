import styled from 'styled-components';

export const HomeRoot = styled.div`
  position: relative;
  margin: calc(-1 * ${({ theme }) => theme.spacing.xxl})
    calc(-1 * ${({ theme }) => theme.spacing.xxxl});
  padding: ${({ theme }) => theme.spacing.xxl}
    ${({ theme }) => theme.spacing.xxxl};
  min-height: calc(100vh - ${({ theme }) => theme.layout.navHeight});
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: calc(-1 * ${({ theme }) => theme.spacing.xl})
      calc(-1 * ${({ theme }) => theme.spacing.lg});
    padding: ${({ theme }) => theme.spacing.xl}
      ${({ theme }) => theme.spacing.lg};
  }
`;

export const HeroCard = styled.section`
  position: relative;
  z-index: 1;
  padding: ${({ theme }) => theme.spacing.xxl};

  header {
    margin-bottom: 0;
  }
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.hero};
  border: 1px solid ${({ theme }) => theme.colors.purpleBorder};
`;

export const TileGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xxl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const HeroActions = styled.div`
  position: relative;
  z-index: 1;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;
