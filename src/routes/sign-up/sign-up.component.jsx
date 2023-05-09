import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { signUpStart } from '../../store/user/user.action';

import { BUTTON_TYPE_CLASSES } from '../../components/button/button.component';
import FormInput from '../../components/form-input/form-input.component';
import Spinner from '../../components/spinner/spinner.component';

import { SignUpButton, SignUpContainer } from './sign-up.styles';
import { selectCurrentUserIsLoading } from '../../store/user/user.selector';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);
  const navigateToWork = () => navigate('/work');

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    dispatch(
      signUpStart({
        email,
        password,
        confirmPassword,
        navigateToWork,
        displayName,
      })
    );

    console.log(formFields);

    // switch (error.code) {
    //   case 'auth/email-already-in-use':
    //     alert('Уже существует аккаунт с таким E-mail');
    //     break;

    //   default:
    //     alert('User creation encountered an error', error);
    // }
  };

  return (
    <Fragment>
      {currentUserIsLoading ? (
        <Spinner />
      ) : (
        <SignUpContainer onSubmit={handleSubmit}>
          <FormInput
            type='text'
            name='displayName'
            value={displayName}
            placeholder='Имя пользователя'
            onChange={handleChange}
            wide
            required
          />

          <FormInput
            type='email'
            name='email'
            value={email}
            placeholder='E-mail'
            onChange={handleChange}
            wide
            required
          />

          <FormInput
            type='password'
            name='password'
            value={password}
            placeholder='Пароль'
            onChange={handleChange}
            minLength={6}
            wide
            required
          />

          <FormInput
            type='password'
            name='confirmPassword'
            value={confirmPassword}
            placeholder='Повторите пароль'
            onChange={handleChange}
            minLength={6}
            wide
            required
          />

          <SignUpButton buttonType={BUTTON_TYPE_CLASSES.arrow} type='submit'>
            <span>Зарегистрироваться</span>
          </SignUpButton>
        </SignUpContainer>
      )}
    </Fragment>
  );
};

export default SignUp;
