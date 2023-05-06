import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectBalance } from '../../store/movement/movement.selector';

import {
  BalanceContainer,
  BalanceWrapper,
  BalanceDate,
  BalanceLabel,
  BalanceValue,
} from './balance.styles';

const Balance = () => {
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
        {balance
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
