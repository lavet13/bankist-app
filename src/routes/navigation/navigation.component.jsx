import { Fragment, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { selectCurrentUser } from '../../store/user/user.selector';

import { fetchLoanAsync } from '../../store/loan/loan.action';
import { selectLoanArray } from '../../store/loan/loan.selector';

import Button, {
  BUTTON_TYPE_CLASSES,
} from '../../components/button/button.component';

import LogoSrc from '../../assets/logo.png';

import { signOutUser } from '../../utils/firebase/firebase.utils';

import {
  LogoIcon,
  NavigationContainer,
  NavigationWrapper,
  NavigationWrapperFlex,
  Title,
  Anchor,
} from './navigation.styles';

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const loanArray = useSelector(selectLoanArray);
  console.log(loanArray);

  const signOutAndGoToHome = () => {
    signOutUser();
    navigate('/');
  };

  useEffect(() => {
    dispatch(fetchLoanAsync(currentUser));
  }, [currentUser]);

  return (
    <NavigationContainer>
      <NavigationWrapper>
        <Anchor to='/'>
          <Title>Bankist app</Title>
        </Anchor>

        <Anchor to='/'>
          <LogoIcon src={LogoSrc} />
        </Anchor>

        <NavigationWrapperFlex>
          {!currentUser ? (
            <Fragment>
              <Anchor to='/sign-in'>Sign In</Anchor>
              <Anchor to='/sign-up'>Sign Up</Anchor>
            </Fragment>
          ) : (
            <Button
              onClick={signOutAndGoToHome}
              buttonType={BUTTON_TYPE_CLASSES.base}
            >
              Sign Out
            </Button>
          )}
        </NavigationWrapperFlex>
      </NavigationWrapper>
      <Outlet />
    </NavigationContainer>
  );
};

export default Navigation;
