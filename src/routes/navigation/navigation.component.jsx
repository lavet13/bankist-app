import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectCurrentUser,
  selectCurrentUserIsLoading,
} from '../../store/user/user.selector';
import { selectUserDropdownIsOpen } from '../../store/user-profile/user-profile.selector';

import UserIcon from '../../components/user-icon/user-icon.component';
import UserDropdown from '../../components/user-dropdown/user-dropdown.component';

import {
  LogoIcon,
  NavigationContainer,
  NavigationWrapper,
  NavigationWrapperFlex,
  Anchor,
} from './navigation.styles';

const Navigation = () => {
  const currentUser = useSelector(selectCurrentUser);
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);
  const isUserDropdownOpen = useSelector(selectUserDropdownIsOpen);

  console.log('render/navigation');

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
                <Anchor to='/sign-in'>Вход</Anchor>
                <Anchor to='/sign-up'>Регистрация</Anchor>
              </Fragment>
            ) : (
              <Fragment>
                {isUserDropdownOpen && <UserDropdown />}
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
