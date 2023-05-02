import styled, { css } from 'styled-components';

export const MovementItemContainer = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;

  padding: 22.5px 40px;
`;

export const MovementType = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 500;
  color: #fff;
  padding: 1px 10px;
  border-radius: 100px;
  margin-right: 20px;
`;

export const MovementTypeDeposit = styled(MovementType)`
  background-image: linear-gradient(to top left, #39b385, #9be15d);
`;

export const MovementTypeWithdrawal = styled(MovementType)`
  background-image: linear-gradient(to top left, #e52a5a, #ff585f);
`;

export const MovementDate = styled.div`
  font-size: 11px;
  font-family: inherit;
  text-transform: uppercase;
  font-weight: 500;
  color: #666;
`;

export const MovementValue = styled.div`
  font-size: 17px;
  margin-left: auto;
`;
