import { useLocation } from 'react-router-dom';
import {
  GetStartedLink,
  Logo,
  LogoMark,
  Nav,
  NavCtaGroup,
  NavInner,
  NavRight,
  SolutionsLink,
  SolutionsMenu,
  SolutionsPanel,
  SolutionsTrigger,
} from './NavBar.styles';

const solutionItems = [
  { to: '/upload/csv', label: 'CSV Upload' },
  { to: '/upload/pdf', label: 'PDF Upload' },
  { to: '/logs', label: 'Log capture' },
  { to: '/troubleshoot', label: 'Troubleshoot' },
] as const;

const GET_STARTED_PATH = '/upload/csv';

export function NavBar() {
  const location = useLocation();
  const solutionsActive = solutionItems.some(({ to }) => location.pathname === to);

  return (
    <Nav>
      <NavInner>
        <Logo to="/">
          <LogoMark>Z</LogoMark>
          Zymbly
        </Logo>
        <NavRight>
          <SolutionsMenu>
            <SolutionsTrigger $active={solutionsActive}>Solutions</SolutionsTrigger>
            <SolutionsPanel>
              {solutionItems.map(({ to, label }) => (
                <SolutionsLink key={to} to={to} $active={location.pathname === to}>
                  {label}
                </SolutionsLink>
              ))}
            </SolutionsPanel>
          </SolutionsMenu>
          <NavCtaGroup>
            <GetStartedLink
              to={GET_STARTED_PATH}
              $active={location.pathname === GET_STARTED_PATH}
            >
              Get Started
            </GetStartedLink>
          </NavCtaGroup>
        </NavRight>
      </NavInner>
    </Nav>
  );
}
