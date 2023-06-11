import moment from 'moment';
import ruLocale from 'moment/locale/ru';

import MovementType, {
  MOVEMENT_TYPES,
} from '../movement-types/movement-type.component';

import {
  MovementDate,
  MovementItemContainer,
  MovementValue,
} from './movement-item.styles';
import { Movement } from '../../utils/firebase/firebase.types';
import { FC } from 'react';

const translateToRussian = {
  withdrawal: 'Расход',
  deposit: 'Приход',
};

type MovementItemProps = {
  movement: Movement;
};

const MovementItem: FC<MovementItemProps> = ({ movement }) => {
  const { date, value } = movement;
  const type = value < 0 ? 'withdrawal' : 'deposit';
  moment.updateLocale('ru', [ruLocale]);

  const dateValue = typeof date === 'string' ? JSON.parse(date) : date;

  const serializedDate = new Date(
    dateValue.seconds * 1000 + dateValue.nanoseconds / 1000000
  );

  return (
    <MovementItemContainer>
      <MovementType type={MOVEMENT_TYPES[type]}>
        {translateToRussian[type]}
      </MovementType>
      <MovementDate>
        {moment(typeof date === 'string' ? serializedDate : dateValue.toDate())
          .startOf('minute')
          .fromNow()}
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
