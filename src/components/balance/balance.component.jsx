import {
  BalanceContainer,
  BalanceWrapper,
  BalanceDate,
  BalanceLabel,
  BalanceValue,
} from './balance.styles';

const Balance = () => {
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
        {`${Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
        }).format(26185.59)}`}
      </BalanceValue>
    </BalanceContainer>
  );
};

export default Balance;
