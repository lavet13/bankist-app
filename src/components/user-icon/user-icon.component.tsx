import { useAppDispatch, useAppSelector } from '../../app/store';

import { userProfileToggled } from '../../features/user-profile/user-profile.slice';
import { selectUserDropdownIsOpen } from '../../features/user-profile/user-profile.selector';

import { UserProfileIcon, UserIconContainer } from './user-icon.styles';

const UserIcon = () => {
  const dispatch = useAppDispatch();
  const isUserDropdownOpen = useAppSelector(selectUserDropdownIsOpen);

  const toggleUserDropdownHandler = () =>
    dispatch(userProfileToggled(!isUserDropdownOpen));

  return (
    <UserIconContainer onClick={toggleUserDropdownHandler}>
      <UserProfileIcon />
    </UserIconContainer>
  );
};

export default UserIcon;
