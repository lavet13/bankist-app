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
  const navigateToWork = () => navigate('work');
  const navigateToLoans = () => navigate('loans');
  const signOutUser = () => dispatch(signOutStart());

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
