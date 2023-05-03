import styled from 'styled-components';

const color = '#888';

export const BalanceContainer = styled.div`
  grid-column: 1 / span 2;

  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
`;

export const BalanceLabel = styled.p`
  font-size: 22px;
  font-weight: 500;
`;

export const BalanceDate = styled.p`
  font-size: 14px;
  color: ${color};
`;

export const BalanceValue = styled.p`
  font-size: 45px;
  font-weight: 400;
`;
