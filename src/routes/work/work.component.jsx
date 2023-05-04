import Balance from '../../components/balance/balance.component';
import Movements from '../../components/movements/movements.component';
import Summary from '../../components/summary/summary.component';
import Transfer from '../../components/transfer/transfer.component';
import Loan from '../../components/loan/loan.component';
import CloseAccount from '../../components/close-account/close-account.component';

import { WorkContainer } from './work.styles';

const Work = () => {
  return (
    <WorkContainer>
      <Balance />
      <Movements />
      <Summary />

      <Transfer />
      <Loan />
      <CloseAccount />
    </WorkContainer>
  );
};

export default Work;
