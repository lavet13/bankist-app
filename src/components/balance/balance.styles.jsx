import styled from 'styled-components';

const color = '#888';

export const BalanceContainer = styled.div`
  grid-column: 1 / span 2;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const BalanceLabel = styled.p`
  font-size: 22px;
  font-weight: 500;
  margin-bottom: -0.2rem;
`;

export const BalanceDate = styled.p`
  font-size: 14px;
  color: ${color};
`;

export const BalanceValue = styled.p`
  font-size: 45px;
  font-weight: 400;
`;
