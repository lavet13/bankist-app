import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import Button, {
  BUTTON_TYPE_CLASSES,
} from '../../components/button/button.component';
import FormInput from '../../components/form-input/form-input.component';

import { SignInFormContainer, SignInButton } from './sign-in.styles';
import {
  signInAuthUserWithEmailAndPassword,
  signInWithGoogleRedirect,
  getGoogleRedirectResult,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

const defaultFormFields = {
  email: '',
  password: '',
};

const SignIn = () => {
  const navigate = useNavigate();
  const goToWork = () => navigate('/work');

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [isLoading, setIsLoading] = useState(false);
  const { email, password } = formFields;

  useEffect(() => {
    (async () => {
      const response = await getGoogleRedirectResult();

      if (response) {
        await createUserDocumentFromAuth(response.user);
        goToWork();
      }
    })();
  }, []);

  const resetFormFields = () => setFormFields(defaultFormFields);

  const handleChange = event => {
    const { name, value } = event.target;

    if (password === 'password' && password.length > 6) return;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await signInAuthUserWithEmailAndPassword(email, password);

      resetFormFields();
      console.log(formFields);
      goToWork();
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
          alert('Incorrect password for email');
          break;
        case 'auth/user-not-found':
          alert('No user associated with this email');
          break;
        case 'auth/network-request-failed':
          alert('Blocked by Firebase');
          break;

        default:
          console.log(error.code);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <SignInFormContainer onSubmit={handleSubmit}>
        <FormInput
          type='email'
          name='email'
          value={email}
          placeholder='E-mail'
          required
          onChange={handleChange}
          wide
        />

        <FormInput
          type='password'
          name='password'
          value={password}
          placeholder='Пароль'
          minLength='6'
          required
          onChange={handleChange}
          wide
        />

        <SignInButton
          spinner={isLoading}
          buttonType={BUTTON_TYPE_CLASSES.arrow}
          type='submit'
        >
          <span>→</span>
        </SignInButton>
      </SignInFormContainer>
      <Button
        onClick={signInWithGoogleRedirect}
        buttonType={BUTTON_TYPE_CLASSES.google}
      >
        Sign In With Google
      </Button>
    </Fragment>
  );
};

export default SignIn;
