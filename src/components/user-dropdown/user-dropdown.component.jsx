import { useDispatch } from 'react-redux';

import { signOutStart } from '../../store/user/user.action';

import { UserDropdownContainer } from './user-dropdown.styles';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

const UserDropdown = () => {
  const dispatch = useDispatch();

  const signOutUser = () => dispatch(signOutStart());

  return (
    <UserDropdownContainer>
      <Button buttonType={BUTTON_TYPE_CLASSES.base}>Настройки</Button>
      <Button onClick={signOutUser} buttonType={BUTTON_TYPE_CLASSES.base}>
        Выйти
      </Button>
    </UserDropdownContainer>
  );
};

export default UserDropdown;
