import { MuiFileInput } from 'mui-file-input';
import styled from 'styled-components';

export const OperationBase = styled.div`
  border-radius: 10px;
  padding: 30px 40px;
  color: #333;
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  grid-template-rows: auto auto;
  gap: 4px 10px;

  & > div {
    grid-column: 1 / -1;
  }
`;

export const OperationInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  border: none;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 7px;
  text-align: center;
  font-family: inherit;
  font-size: 15px;
  color: #333;
  transition: all 0.3s;

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.6);
  }
`;

export const OperationLabel = styled.label`
  font-size: 13px;
  text-align: center;
  align-self: center;
`;

export const Title = styled.h2`
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

export const TransferContainer = styled(OperationBase)`
  background-image: linear-gradient(to top left, #ffb003, #ffcb03);
`;
