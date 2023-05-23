import { useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  googleSignInStart,
  emailSignInStart,
  closeSignInErrorMessage,
} from '../../store/user/user.action';

import {
  selectCurrentUserIsLoading,
  selectEmailSignInIsLoading,
  selectGoogleSignInIsLoading,
  selectSignInError,
  selectSignOutError,
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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { SignInFormContainer } from './sign-in.styles';
import {
  getSignInEmailError,
  getSignInPasswordError,
  getSignInWarningMessage,
} from '../../store/user/user.error';
import { getErrorMessage } from '../../utils/error/error.utils';

const defaultFormFields = {
  email: '',
  password: '',
};

const SignIn = () => {
  const dispatch = useDispatch();
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);
  const emailSignInIsLoading = useSelector(selectEmailSignInIsLoading);
  const googleSignInIsLoading = useSelector(selectGoogleSignInIsLoading);
  const error = useSelector(selectSignInError);
  const signOutError = useSelector(selectSignOutError);

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = event => event.preventDefault();
  const handleErrorMessage = () => dispatch(closeSignInErrorMessage());
  const signInWithGoogle = () => dispatch(googleSignInStart());
  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };
  const handleSubmit = async event => {
    event.preventDefault();

    dispatch(emailSignInStart(email, password));
  };

  const hasUnknownError = error =>
    getSignInPasswordError(error) ||
    getSignInEmailError(error) ||
    getSignInWarningMessage(error);

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
              error={error && !!getSignInEmailError(error)}
            >
              <InputLabel htmlFor='filled-email'>E-mail</InputLabel>
              <FilledInput
                id='filled-email'
                type='email'
                name='email'
                value={email}
                onChange={handleChange}
              />
              {error && (
                <FormHelperText>{getSignInEmailError(error)}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              sx={{ m: 1, width: '40ch' }}
              variant='filled'
              error={error && !!getSignInPasswordError(error)}
            >
              <InputLabel htmlFor='filled-adornment-password'>
                Пароль
              </InputLabel>
              <FilledInput
                id='filled-adornment-password'
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={password}
                onChange={handleChange}
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
                <FormHelperText>{getSignInPasswordError(error)}</FormHelperText>
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
            {error && hasUnknownError(error) === null ? (
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
                {getErrorMessage(error)}
              </Alert>
            ) : null}

            {signOutError && (
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
                {getErrorMessage(signOutError)}
              </Alert>
            )}

            {error && getSignInWarningMessage(error) && (
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
                {getSignInWarningMessage(error)}
              </Alert>
            )}
          </SignInFormContainer>
        </Fragment>
      )}
    </Fragment>
  );
};

export default SignIn;
