import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
  SummaryContainer,
  SummaryLabel,
  SummaryValueIn,
  SummaryValueInterest,
  SummaryValueOut,
} from './summary.styles';

const Summary = () => {
  return (
    <SummaryContainer>
      <SummaryLabel>In</SummaryLabel>
      <SummaryValueIn>
        {Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
        }).format(27035.2)}
      </SummaryValueIn>
      <SummaryLabel>Out</SummaryLabel>
      <SummaryValueOut>
        {Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
        }).format(1082.61)}
      </SummaryValueOut>
      <SummaryLabel>Interest</SummaryLabel>
      <SummaryValueInterest>
        {Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
        }).format(323.46)}
      </SummaryValueInterest>
      <Button buttonType={BUTTON_TYPE_CLASSES.arrowSort}>↓ SORT</Button>
    </SummaryContainer>
  );
};

export default Summary;
