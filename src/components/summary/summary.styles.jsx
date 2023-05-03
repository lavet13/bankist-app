import styled from 'styled-components';

export const SummaryContainer = styled.div`
  grid-row: 5 / 6;

  display: flex;
  align-items: baseline;
  padding: 0 3px;
  margin-top: 10px;
`;

export const SummaryLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  margin-right: 8px;
`;

export const SummaryValueBase = styled.p`
  font-size: 22px;
  margin-right: 25px;
`;

export const SummaryValueIn = styled(SummaryValueBase)`
  color: #66c873;
`;

export const SummaryValueOut = styled(SummaryValueBase)`
  color: #f5465d;
`;

export const SummaryValueInterest = styled(SummaryValueIn)``;
