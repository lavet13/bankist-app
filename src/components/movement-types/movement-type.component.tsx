import { FC, PropsWithChildren } from 'react';
import {
  MovementTypeBase,
  MovementTypeDeposit,
  MovementTypeWithdrawal,
} from './movement-type.styles';

export enum MOVEMENT_TYPES {
  deposit = 'movement/deposit',
  withdrawal = 'movement/withdrawal',
}

const getMovementType = (
  type = MOVEMENT_TYPES.deposit
): typeof MovementTypeBase =>
  ({
    [MOVEMENT_TYPES.deposit]: MovementTypeDeposit,
    [MOVEMENT_TYPES.withdrawal]: MovementTypeWithdrawal,
  }[type]);

type MovementTypeProps = {
  type: MOVEMENT_TYPES;
};

const MovementType: FC<PropsWithChildren<MovementTypeProps>> = ({
  type,
  children,
}) => {
  const CustomMovement = getMovementType(type);

  return <CustomMovement>{children}</CustomMovement>;
};

export default MovementType;
