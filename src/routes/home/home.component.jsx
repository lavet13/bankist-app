import { Fragment } from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentUserIsLoading } from '../../store/user/user.selector';

import Spinner from '../../components/spinner/spinner.component';

import { HomeContainer } from './home.styles';

const Home = () => {
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);

  return (
    <Fragment>
      {currentUserIsLoading ? <Spinner /> : <HomeContainer></HomeContainer>}
    </Fragment>
  );
};

export default Home;
