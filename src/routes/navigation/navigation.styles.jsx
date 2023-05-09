import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { ReactComponent as Logo } from '../../assets/logo.svg';

export const Title = styled.h1`
  font-size: 36px;
  font-weight: 500;
  line-height: 1.1;
  margin: 0;
  text-transform: capitalize;
`;

export const NavigationContainer = styled.nav`
  display: flex;
  flex-direction: column;
  row-gap: 25px;
  max-width: 1200px;
  margin: 0 auto;

  @media only screen and (max-width: 76.25em) {
    padding: 0 15px;
  }
`;

export const NavigationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 20px;

  margin-top: 15px;

  @media only screen and (max-width: 28.125em) {
    flex-direction: column-reverse;
    row-gap: 15px;
  }
`;

export const NavigationWrapperFlex = styled.div`
  display: flex;
  column-gap: 15px;
`;

export const LogoIcon = styled(Logo)`
  display: block;
  width: 100%;
  height: 80px;
  object-fit: cover;
`;

export const Anchor = styled(Link)`
  display: flex;
  align-items: center;
  column-gap: 1rem;
  text-decoration: none;
  color: inherit;
  font-family: inherit;
  white-space: nowrap;
`;
