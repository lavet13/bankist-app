import { useSelector } from 'react-redux';

import { selectBalance } from '../../store/movement/movement.selector';
import { selectCurrentUser } from '../../store/user/user.selector';

import {
  BalanceContainer,
  BalanceWrapper,
  BalanceDate,
  BalanceLabel,
  BalanceValue,
} from './balance.styles';

const Balance = () => {
  const currentUser = useSelector(selectCurrentUser);
  const balance = useSelector(selectBalance);

  return (
    <BalanceContainer>
      <BalanceWrapper>
        <BalanceLabel>Текущий баланс</BalanceLabel>
        <BalanceDate>
          По состоянию на{' '}
          {`${Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format()}`}
        </BalanceDate>
      </BalanceWrapper>
      <BalanceValue>
        {currentUser && balance
          ? `${Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
            }).format(balance)}`
          : null}
      </BalanceValue>
    </BalanceContainer>
  );
};

export default Balance;
