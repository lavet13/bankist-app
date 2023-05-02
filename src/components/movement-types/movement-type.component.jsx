import {
  MovementTypeDeposit,
  MovementTypeWithdrawal,
} from './movement-type.styles';

export const MOVEMENT_TYPES = {
  deposit: 'movement/deposit',
  withdrawal: 'movement/withdrawal',
};

const getMovementType = (type = MOVEMENT_TYPES.deposit) =>
  ({
    [MOVEMENT_TYPES.deposit]: MovementTypeDeposit,
    [MOVEMENT_TYPES.withdrawal]: MovementTypeWithdrawal,
  }[type]);

const MovementType = ({ type, children }) => {
  const CustomMovement = getMovementType(type);

  return <CustomMovement>{children}</CustomMovement>;
};

export default MovementType;
