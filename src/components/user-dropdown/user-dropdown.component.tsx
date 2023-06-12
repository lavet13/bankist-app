import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { signOutStarted } from '../../store/user/user.reducer';

import {
  UserDropdownContainer,
  UserDropdownButton,
} from './user-dropdown.styles';

const UserDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateToSettings = () => navigate('settings');
  const navigateToWork = () => navigate('work');
  const navigateToLoans = () => navigate('loans');
  const signOutUser = () => dispatch(signOutStarted());

  return (
    <UserDropdownContainer>
      <UserDropdownButton onClick={navigateToLoans}>
        Мои кредиты
      </UserDropdownButton>
      <UserDropdownButton onClick={navigateToWork}>
        Личный кабинет
      </UserDropdownButton>
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
