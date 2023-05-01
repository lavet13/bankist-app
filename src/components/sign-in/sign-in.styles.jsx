import styled from 'styled-components';

export const SignInFormContainer = styled.form`
  display: flex;
  align-items: center;
  column-gap: 12px;

  @media only screen and (max-width: 28.125em) {
    flex-direction: column;
    row-gap: 15px;
  }
`;
