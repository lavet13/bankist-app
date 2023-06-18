import { formatDistanceToNow } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';

import MovementType, {
  MOVEMENT_TYPES,
} from '../movement-types/movement-type.component';

import {
  MovementDate,
  MovementItemContainer,
  MovementValue,
} from './movement-item.styles';
import { FC } from 'react';
import { MovementItemType } from '../../features/movement/movement.types';

const translateToRussian = {
  withdrawal: 'Расход',
  deposit: 'Приход',
};

type MovementItemProps = {
  movement: MovementItemType;
};

const MovementItem: FC<MovementItemProps> = ({ movement }) => {
  const { date, value } = movement;

  const type = value < 0 ? 'withdrawal' : 'deposit';

  return (
    <MovementItemContainer>
      <MovementType type={MOVEMENT_TYPES[type]}>
        {translateToRussian[type]}
      </MovementType>
      <MovementDate>
        {formatDistanceToNow(new Date(date), {
          includeSeconds: true,
          locale: ruLocale,
          addSuffix: true,
        })}
      </MovementDate>
      <MovementValue>
        {Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
        }).format(value)}
      </MovementValue>
    </MovementItemContainer>
  );
};

export default MovementItem;
