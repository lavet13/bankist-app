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

const translateToRussian = {
  withdrawal: 'Расход',
  deposit: 'Приход',
};

const MovementItem = ({ movement }) => {
  const { date, value } = movement;
  const type = value < 0 ? 'withdrawal' : 'deposit';
  moment.updateLocale('ru', [ruLocale]);

  return (
    <MovementItemContainer>
      <MovementType type={MOVEMENT_TYPES[type]}>
        {translateToRussian[type]}
      </MovementType>
      <MovementDate>
        {moment(date.toDate()).startOf('minute').fromNow()}
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
