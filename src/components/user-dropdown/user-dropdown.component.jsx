import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { signOutStart } from '../../store/user/user.action';

import {
  UserDropdownContainer,
  UserDropdownButton,
} from './user-dropdown.styles';

const UserDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateToSettings = () => navigate('settings');
  const signOutUser = () => dispatch(signOutStart());

  return (
    <UserDropdownContainer>
      <UserDropdownButton onClick={navigateToSettings}>
        Настройки
      </UserDropdownButton>
      <UserDropdownButton onClick={signOutUser} signOut>
        Выйти
      </UserDropdownButton>
    </UserDropdownContainer>
  );
};

export default UserDropdown;
