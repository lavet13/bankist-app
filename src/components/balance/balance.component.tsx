import { Fragment } from 'react';

import { selectBalance } from '../../features/movement/movement.selector';
import { selectMovementsIsLoading } from '../../features/movement/movement.selector';

import {
  BalanceContainer,
  BalanceWrapper,
  BalanceDate,
  BalanceLabel,
  BalanceValue,
} from './balance.styles';
import { useAppSelector } from '../../app/store';

const Balance = () => {
  const balance = useAppSelector(selectBalance);
  const movementsIsLoading = useAppSelector(selectMovementsIsLoading);

  return (
    <BalanceContainer>
      {movementsIsLoading ? null : (
        <Fragment>
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
            {`${Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
            }).format(balance)}`}
          </BalanceValue>
        </Fragment>
      )}
    </BalanceContainer>
  );
};

export default Balance;
