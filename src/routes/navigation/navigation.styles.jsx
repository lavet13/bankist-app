import styled from 'styled-components';

export const Title = styled.h1`
  font-size: 36px;
  font-weight: 500;
  line-height: 1.1;
  margin: 0;
  text-transform: capitalize;
`;

export const NavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 25px;
`;

export const NavigationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 20px;

  margin-top: 15px;

  @media only screen and (max-width: 28.125em) {
    flex-direction: column-reverse;
    row-gap: 15px;
  }
`;

export const LogoIcon = styled.img`
  display: block;
  width: 60px;
  height: 60px;
  object-fit: cover;
`;
