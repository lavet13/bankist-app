import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BUTTON_TYPE_CLASSES } from '../../components/button/button.component';
import FormInput from '../../components/form-input/form-input.component';

import { SignUpButton, SignUpContainer } from './sign-up.styles';
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUp = () => {
  const navigate = useNavigate();
  const goToWork = () => navigate('/work');

  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  const resetFormFields = () => setFormFields(defaultFormFields);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      alert('Пароли не совпадают!');
      setIsLoading(false);
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user, { displayName });

      resetFormFields();
      console.log(formFields);
      goToWork();
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('Уже существует аккаунт с таким E-mail');
          break;

        default:
          alert('User creation encountered an error', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

      <SignUpButton
        spinner={isLoading}
        buttonType={BUTTON_TYPE_CLASSES.arrow}
        type='submit'
      >
        <span>→</span>
      </SignUpButton>
    </SignUpContainer>
  );
};

export default SignUp;
