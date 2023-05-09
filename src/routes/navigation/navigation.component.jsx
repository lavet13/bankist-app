import { Fragment } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectCurrentUser,
  selectCurrentUserIsLoading,
} from '../../store/user/user.selector';
import { signOutStart } from '../../store/user/user.action';

// import { fetchLoanStart } from '../../store/loan/loan.action';
// import { selectLoanArray } from '../../store/loan/loan.selector';

import Button, {
  BUTTON_TYPE_CLASSES,
} from '../../components/button/button.component';

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
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);

  const navigateToHome = () => navigate('/');

  console.log('render/navigation');

  const signOutUser = () => dispatch(signOutStart(navigateToHome));

  return (
    <NavigationContainer>
      {currentUserIsLoading ? null : (
        <NavigationWrapper>
          <Anchor to='/'>
            <LogoIcon />
          </Anchor>

          <NavigationWrapperFlex>
            {!currentUser ? (
              <Fragment>
                <Anchor to='/sign-in'>Sign In</Anchor>
                <Anchor to='/sign-up'>Sign Up</Anchor>
              </Fragment>
            ) : (
              <Button
                onClick={signOutUser}
                buttonType={BUTTON_TYPE_CLASSES.base}
              >
                Sign Out
              </Button>
            )}
          </NavigationWrapperFlex>
        </NavigationWrapper>
      )}
      <Outlet />
    </NavigationContainer>
  );
};

export default Navigation;
