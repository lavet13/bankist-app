import Balance from '../../components/balance/balance.component';
import Movements from '../../components/movements/movements.component';
import Summary from '../../components/summary/summary.component';
import Transfer from '../../components/transfer/transfer.component';
import LoanForm from '../../components/loan/loan-form.component';
import CloseAccount from '../../components/close-account/close-account.component';

import { WorkContainer } from './work.styles';

const Work = () => {
  return (
    <WorkContainer>
      <Balance />
      <Movements />
      <Summary />

      <Transfer />
      <LoanForm />
      <CloseAccount />
    </WorkContainer>
  );
};

export default Work;
