import styled from 'styled-components';
import Button from '../button/button.component';

import { ReactComponent as Checkmark } from '../../assets/checkmark.svg';
import { ReactComponent as Times } from '../../assets/times-circle.svg';
import { ReactComponent as InProcess } from '../../assets/hour-glass.svg';

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

export const InProcessIcon = styled(InProcess)`
  fill: orange;
  width: 20px;
  height: 20px;
`;

export const AllowButton = styled(Button)`
  color: #fff;
  background: #9be15d;
`;

export const DenyButton = styled(Button)`
  color: #fff;
  background: red;
`;

export const ButtonContainer = styled.div`
  display: flex;
  column-gap: 10px;
`;
