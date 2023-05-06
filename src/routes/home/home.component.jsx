import { useNavigate } from 'react-router-dom';
import { HomeContainer } from './home.styles';
import Button, {
  BUTTON_TYPE_CLASSES,
} from '../../components/button/button.component';
import Spinner from '../../components/spinner/spinner.component';

const Home = () => {
  const navigate = useNavigate();
  const goToWork = () => navigate('work');

  return (
    <HomeContainer>
      <Button onClick={goToWork} buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}>
        WORK :)
      </Button>
    </HomeContainer>
  );
};

export default Home;
