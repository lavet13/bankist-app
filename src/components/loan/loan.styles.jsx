import styled from 'styled-components';

import { OperationBase } from '../transfer/transfer.styles';

export const LoanContainer = styled(OperationBase)`
  background-image: linear-gradient(to top left, #39b385, #9be15d);
`;

export const ErrorMessage = styled.span`
  color: ${({ error }) => (error ? '#d32f2f' : '#000')};
  align-self: center;
  font-size: 14px;
  overflow: hidden;
  width: 200px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
