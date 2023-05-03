import { HomeContainer } from './home.styles';
import Balance from '../../components/balance/balance.component';
import Movements from '../../components/movements/movements.component';
import Summary from '../../components/summary/summary.component';
import Transfer from '../../components/transfer/transfer.component';
import Loan from '../../components/loan/loan.component';
import CloseAccount from '../../components/close-account/close-account.component';

const Home = () => {
  return (
    <HomeContainer>
      <Balance />
      <Movements />
      <Summary />
      <Transfer />
      <Loan />
      <CloseAccount />
    </HomeContainer>
  );
};

export default Home;
