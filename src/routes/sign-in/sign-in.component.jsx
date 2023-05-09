import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  googleSignInStart,
  emailSignInStart,
} from '../../store/user/user.action';

import { selectCurrentUserIsLoading } from '../../store/user/user.selector';

import Button, {
  BUTTON_TYPE_CLASSES,
} from '../../components/button/button.component';
import FormInput from '../../components/form-input/form-input.component';
import Spinner from '../../components/spinner/spinner.component';

import { SignInFormContainer, SignInButton } from './sign-in.styles';

const defaultFormFields = {
  email: '',
  password: '',
};

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);
  const navigateToWorkPage = () => navigate('/work');

  const [formIsLoading, setFormIsLoading] = useState(false);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const signInWithGoogle = () => {
    dispatch(googleSignInStart(navigateToWorkPage));
  };

  const resetForm = () => setFormFields(defaultFormFields);

  const handleChange = event => {
    const { name, value } = event.target;

    if (password === 'password' && password.length > 6) return;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    dispatch(
      emailSignInStart(
        email,
        password,
        resetForm,
        navigateToWorkPage,
        setFormIsLoading
      )
    );
    console.log(formFields);

    // switch (error.code) {
    //   case 'auth/wrong-password':
    //     alert('Incorrect password for email');
    //     break;
    //   case 'auth/user-not-found':
    //     alert('No user associated with this email');
    //     break;
    //   case 'auth/network-request-failed':
    //     alert('Blocked by Firebase');
    //     break;

    //   default:
    //     console.log(error.code);
    // }
  };

  return (
    <Fragment>
      {currentUserIsLoading ? (
        <Spinner />
      ) : (
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
              spinner={formIsLoading}
              buttonType={BUTTON_TYPE_CLASSES.arrow}
              type='submit'
            >
              <span>Войти в аккаунт</span>
            </SignInButton>
          </SignInFormContainer>
          <Button
            onClick={signInWithGoogle}
            buttonType={BUTTON_TYPE_CLASSES.google}
            mt
          >
            Войти через Google
          </Button>
        </Fragment>
      )}
    </Fragment>
  );
};

export default SignIn;
