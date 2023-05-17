import styled from 'styled-components';
import { ReactComponent as Checkmark } from '../../assets/checkmark.svg';
import { ReactComponent as Times } from '../../assets/times-circle.svg';

export const Background = styled.div`
  background-color: #eee;
  border-bottom: 1px solid #ccc;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding-bottom: 20px;
`;

export const LoanItemContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

export const LoanImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 20px;

  & img:first-child {
    border-top-left-radius: 10px;
  }

  & img:last-child {
    border-bottom-right-radius: 10px;
  }
`;

export const LoanImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
`;

export const AllowedIcon = styled(Checkmark)`
  fill: green;
`;

export const DeniedIcon = styled(Times)`
  fill: #cb1f1f;
`;
