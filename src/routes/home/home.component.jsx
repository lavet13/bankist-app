import { HomeContainer } from './home.styles';
import Balance from '../../components/balance/balance.component';
import Movements from '../../components/movements/movements.component';

const Home = () => {
  return (
    <HomeContainer>
      <Balance />
      <Movements />
    </HomeContainer>
  );
};

export default Home;
