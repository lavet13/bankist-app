import { useDispatch } from 'react-redux';

import { signOutStart } from '../../store/user/user.action';

import {
  UserDropdownContainer,
  UserDropdownButton,
} from './user-dropdown.styles';

const UserDropdown = () => {
  const dispatch = useDispatch();

  const signOutUser = () => dispatch(signOutStart());

  return (
    <UserDropdownContainer>
      <UserDropdownButton>Настройки</UserDropdownButton>
      <UserDropdownButton onClick={signOutUser} signOut>
        Выйти
      </UserDropdownButton>
    </UserDropdownContainer>
  );
};

export default UserDropdown;
