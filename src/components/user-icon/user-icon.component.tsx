import { useDispatch } from 'react-redux';

import { userProfileToggled } from '../../features/user-profile/user-profile.slice';
import { selectUserDropdownIsOpen } from '../../features/user-profile/user-profile.selector';

import { UserProfileIcon, UserIconContainer } from './user-icon.styles';
import { useAppSelector } from '../../app/store';

const UserIcon = () => {
  const dispatch = useDispatch();
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
