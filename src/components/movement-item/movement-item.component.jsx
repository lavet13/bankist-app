import {
  MovementDate,
  MovementItemContainer,
  MovementType,
  MovementValue,
} from './movement-item.styles';

const MovementItem = ({ movement }) => {
  const { type, date, value } = movement;
  return (
    <MovementItemContainer>
      <MovementType>{type}</MovementType>
      <MovementDate>{date}</MovementDate>
      <MovementValue>{value}</MovementValue>
    </MovementItemContainer>
  );
};

export default MovementItem;
