import { useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  googleSignInStart,
  emailSignInStart,
  closeErrorMessage,
} from '../../store/user/user.action';

import {
  selectCurrentUserIsLoading,
  selectEmailSignInIsLoading,
  selectError,
  selectGoogleSignInIsLoading,
} from '../../store/user/user.selector';

import Spinner from '../../components/spinner/spinner.component';

import {
  Alert,
  AlertTitle,
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { SignInFormContainer } from './sign-in.styles';

const defaultFormFields = {
  email: '',
  password: '',
};

const SignIn = () => {
  const dispatch = useDispatch();
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);
  const emailSignInIsLoading = useSelector(selectEmailSignInIsLoading);
  const googleSignInIsLoading = useSelector(selectGoogleSignInIsLoading);
  const error = useSelector(selectError);

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = event => event.preventDefault();
  const handleErrorMessage = () => dispatch(closeErrorMessage());
  const signInWithGoogle = () => dispatch(googleSignInStart());
  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };
  const handleSubmit = async event => {
    event.preventDefault();

    dispatch(emailSignInStart(email, password));
  };

  const getErrorMessage = errorCode => {
    switch (errorCode) {
      case 'auth/network-request-failed':
        return 'Ошибка сети! Это все что могу сказать!';
      case 'auth/popup-blocked':
        return 'Заблокирован сервером Firebase!';
      default:
        return null;
    }
  };

  const getWarningMessage = errorCode => {
    switch (errorCode) {
      case 'auth/cancelled-popup-request':
        return 'Аутентификация при помощи Google была отменена!';
      case 'auth/popup-closed-by-user':
        return 'Аутентификация при помощи Google была отменена пользователем!';
      default:
        return null;
    }
  };

  const getSignInEmailError = errorCode => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Нет пользователя ассоциированного с данным E-mail';
      default:
        return null;
    }
  };

  const getSignInPasswordError = errorCode => {
    switch (errorCode) {
      case 'auth/wrong-password':
        return 'Указан неправильный пароль!';
      default:
        return null;
    }
  };

  return (
    <Fragment>
      {currentUserIsLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <SignInFormContainer onSubmit={handleSubmit}>
            <FormControl
              sx={{ m: 1, width: '40ch' }}
              variant='filled'
              error={error && !!getSignInEmailError(error.code)}
            >
              <InputLabel htmlFor='filled-email'>E-mail</InputLabel>
              <FilledInput
                id='filled-email'
                type='email'
                name='email'
                value={email}
                onChange={handleChange}
                required
              />
              {error && (
                <FormHelperText>
                  {getSignInEmailError(error.code)}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              sx={{ m: 1, width: '40ch' }}
              variant='filled'
              error={error && !!getSignInPasswordError(error.code)}
            >
              <InputLabel htmlFor='filled-adornment-password'>
                Password
              </InputLabel>
              <FilledInput
                id='filled-adornment-password'
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={password}
                onChange={handleChange}
                required
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {error && (
                <FormHelperText>
                  {getSignInPasswordError(error.code)}
                </FormHelperText>
              )}
            </FormControl>

            <LoadingButton
              sx={{ m: 1, width: '30ch' }}
              size='large'
              type='submit'
              loading={emailSignInIsLoading}
              variant='contained'
            >
              <span>Войти в аккаунт</span>
            </LoadingButton>

            <LoadingButton
              sx={{ m: 1, width: '30ch', fontSize: '15px', fontWeight: 500 }}
              type='button'
              size='large'
              loading={googleSignInIsLoading}
              onClick={signInWithGoogle}
            >
              <span>Войти через Google</span>
            </LoadingButton>
          </SignInFormContainer>
          {error && getErrorMessage(error.code) !== null ? (
            <Alert
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={handleErrorMessage}
                >
                  <Close fontSize='inherit' />
                </IconButton>
              }
              severity='error'
              sx={{ margin: '0 auto', width: '90%' }}
            >
              <AlertTitle>Ошибка</AlertTitle>
              {getErrorMessage(error.code)}
            </Alert>
          ) : null}

          {error && getWarningMessage(error.code) !== null ? (
            <Alert
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={handleErrorMessage}
                >
                  <Close fontSize='inherit' />
                </IconButton>
              }
              severity='info'
              sx={{ margin: '0 auto', width: '90%' }}
            >
              <AlertTitle>Информация</AlertTitle>
              {getWarningMessage(error.code)}
            </Alert>
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
};

export default SignIn;
