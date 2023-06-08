import styled from 'styled-components';

export const MovementTypeBase = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 500;
  color: #fff;
  padding: 1px 10px;
  border-radius: 100px;
  margin-right: 20px;
`;

export const MovementTypeDeposit = styled(MovementTypeBase)`
  background-image: linear-gradient(to top left, #39b385, #9be15d);
`;

export const MovementTypeWithdrawal = styled(MovementTypeBase)`
  background-image: linear-gradient(to top left, #e52a5a, #ff585f);
`;
