import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectCurrentUserIsLoading } from '../../store/user/user.selector';

import Button, {
  BUTTON_TYPE_CLASSES,
} from '../../components/button/button.component';
import Spinner from '../../components/spinner/spinner.component';

import { HomeContainer } from './home.styles';

const Home = () => {
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);
  const navigate = useNavigate();
  const goToWork = () => navigate('work');

  return (
    <Fragment>
      {currentUserIsLoading ? (
        <Spinner />
      ) : (
        <HomeContainer>
          <Button
            onClick={goToWork}
            buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}
          >
            WORK :)
          </Button>
        </HomeContainer>
      )}
    </Fragment>
  );
};

export default Home;
