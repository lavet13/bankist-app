import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';
import FormInput from '../form-input/form-input.component';

import { SignInFormContainer } from './sign-in.styles';

const defaultFormFields = {
  user: '',
  password: '',
};

const SignIn = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [isLoading, setIsLoading] = useState(false);
  const { user, password } = formFields;

  const navigate = useNavigate();

  const goToHome = () => navigate('home');

  const resetFormFields = () => setFormFields(defaultFormFields);

  const handleChange = event => {
    const { name, value } = event.target;

    if (name === 'password' && password.length > 4) return;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setIsLoading(true);

    resetFormFields();
    setIsLoading(false);
    goToHome();
  };
  return (
    <SignInFormContainer onSubmit={handleSubmit}>
      <FormInput
        type='text'
        name='user'
        value={user}
        placeholder='User'
        required
        onChange={handleChange}
      />
      <FormInput
        type='password'
        name='password'
        value={password}
        placeholder='PIN'
        minLength='4'
        maxLength='4'
        required
        onChange={handleChange}
      />
      <Button
        spinner={isLoading}
        buttonType={BUTTON_TYPE_CLASSES.arrow}
        type='submit'
      >
        →
      </Button>
    </SignInFormContainer>
  );
};

export default SignIn;
