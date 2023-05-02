import MovementType, {
  MOVEMENT_TYPES,
} from '../movement-types/movement-type.component';

import {
  MovementDate,
  MovementItemContainer,
  MovementValue,
} from './movement-item.styles';

const MovementItem = ({ movement }) => {
  const { type, date, value } = movement;

  return (
    <MovementItemContainer>
      <MovementType type={MOVEMENT_TYPES[type]}>{type}</MovementType>
      <MovementDate>{date}</MovementDate>
      <MovementValue>{value}</MovementValue>
    </MovementItemContainer>
  );
};

export default MovementItem;
