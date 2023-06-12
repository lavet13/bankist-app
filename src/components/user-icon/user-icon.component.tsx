import { useDispatch } from 'react-redux';

import { userProfileToggled } from '../../store/user-profile/user-profile.reducer';
import { selectUserDropdownIsOpen } from '../../store/user-profile/user-profile.selector';

import { UserProfileIcon, UserIconContainer } from './user-icon.styles';
import { useAppSelector } from '../../store/store';

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
