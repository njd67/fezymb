import styled from 'styled-components';

export const PageLoaderWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  min-height: 12rem;
`;
