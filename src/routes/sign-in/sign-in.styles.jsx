import styled from 'styled-components';
import { ArrowButton } from '../../components/button/button.styles';

export const SignInFormContainer = styled.form`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 12px;

  input {
    @media only screen and (max-width: 37.5em) {
      width: 60%;
    }
  }

  @media only screen and (max-width: 28.125em) {
    flex-direction: column;
    row-gap: 15px;
  }
`;

export const SignInButton = styled(ArrowButton)`
  width: 60%;
  align-self: center;
`;
