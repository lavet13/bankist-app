import styled from 'styled-components';
import { ArrowButton } from '../../components/button/button.styles';

export const SignUpContainer = styled.form`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 12px;
`;

export const SignUpButton = styled(ArrowButton)`
  width: 60%;
  align-self: center;
`;
