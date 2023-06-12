import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/store';
import { useNavigate } from 'react-router-dom';

import {
  selectCurrentUser,
  selectCurrentUserIsLoading,
} from '../../features/user/user.selector';
import { selectUserDropdownIsOpen } from '../../features/user-profile/user-profile.selector';

import UserIcon from '../../components/user-icon/user-icon.component';
import UserDropdown from '../../components/user-dropdown/user-dropdown.component';

import {
  LogoIcon,
  NavigationContainer,
  NavigationWrapper,
  NavigationWrapperFlex,
  Anchor,
} from './navigation.styles';
import { Button } from '@mui/material';

const Navigation = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserIsLoading = useAppSelector(selectCurrentUserIsLoading);
  const isUserDropdownOpen = useAppSelector(selectUserDropdownIsOpen);

  const navigateToSignInHandler = () => navigate('/sign-in');
  const navigateToSignUpHandler = () => navigate('/sign-up');

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
                <Button variant='text' onClick={navigateToSignInHandler}>
                  Вход
                </Button>
                <Button variant='text' onClick={navigateToSignUpHandler}>
                  Регистрация
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                {isUserDropdownOpen && <UserDropdown />}
                {currentUser.email}
                <UserIcon />
              </Fragment>
            )}
          </NavigationWrapperFlex>
        </NavigationWrapper>
      )}
      <Outlet />
    </NavigationContainer>
  );
};

export default Navigation;
