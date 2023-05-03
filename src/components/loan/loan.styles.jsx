import styled from 'styled-components';

import {
  OperationBase,
  Form,
  OperationLabel,
} from '../transfer/transfer.styles';

export const LoanContainer = styled(OperationBase)`
  background-image: linear-gradient(to top left, #39b385, #9be15d);
`;

export const FormLoan = styled(Form)`
  grid-template-columns: 2.5fr 1fr 2.5fr;
`;

export const LoanLabel = styled(OperationLabel)`
  grid-row: 2;
`;
