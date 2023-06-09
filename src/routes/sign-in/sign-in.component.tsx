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
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { SignInFormContainer } from './sign-in.styles';
import {
  USER_ERROR_MESSAGES,
  getSignInEmailError,
  getSignInPasswordError,
  getSignInWarningMessage,
} from '../../store/user/user.error';
import { getErrorMessage } from '../../utils/error/error.utils';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

export type SignInDefaultValues = {
  email: string;
  password: string;
};

const defaultValues: SignInDefaultValues = {
  email: '',
  password: '',
};

const SignIn = () => {
  const { control, handleSubmit } = useForm<SignInDefaultValues>({
    defaultValues,
  });
  const dispatch = useDispatch();
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);
  const emailSignInIsLoading = useSelector(selectEmailSignInIsLoading);
  const googleSignInIsLoading = useSelector(selectGoogleSignInIsLoading);
  const signInError = useSelector(selectSignInError);
  const signOutError = useSelector(selectSignOutError);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => event.preventDefault();
  const handleErrorMessage = () => dispatch(closeSignInErrorMessage());
  const signInWithGoogle = () => dispatch(googleSignInStart());

  const onSubmit: SubmitHandler<SignInDefaultValues> = data => {
    if (emailSignInIsLoading || googleSignInIsLoading) return;

    const { email, password } = data;

    dispatch(emailSignInStart(email, password));
  };

  return (
    <Fragment>
      {currentUserIsLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <SignInFormContainer onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name='email'
              control={control}
              rules={{
                required: 'Обязательно к заполнению!',
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Неверный формат E-mail',
                },
              }}
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                  {...field}
                  label='E-mail'
                  variant='filled'
                  sx={{ m: 1, width: '40ch' }}
                  error={
                    invalid ||
                    (!!signInError?.code && !!getSignInEmailError(signInError))
                  }
                  helperText={
                    error
                      ? error.message
                      : !!signInError?.code && getSignInEmailError(signInError)
                  }
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              rules={{
                validate: value =>
                  value.length >= 6 ||
                  'Пароль должен составлять как минимум 6 символов',
                required: 'Обязательно к заполнению!',
              }}
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                  {...field}
                  label='Пароль'
                  type={showPassword ? 'text' : 'password'}
                  variant='filled'
                  InputProps={{
                    endAdornment: (
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
                    ),
                  }}
                  sx={{ m: 1, width: '40ch' }}
                  error={
                    invalid ||
                    (!!signInError?.code &&
                      !!getSignInPasswordError(signInError))
                  }
                  helperText={
                    error
                      ? error.message
                      : !!signInError?.code &&
                        getSignInPasswordError(signInError)
                  }
                />
              )}
            />

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

            {signInError &&
              !USER_ERROR_MESSAGES[
                signInError.code ? signInError.code : ''
              ] && (
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
                  {signInError.code
                    ? getErrorMessage(signInError)
                    : signInError.message}
                </Alert>
              )}

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
                {signOutError.code
                  ? getErrorMessage(signOutError)
                  : signOutError.message}
              </Alert>
            )}

            {signInError?.code && getSignInWarningMessage(signInError) && (
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
                {getSignInWarningMessage(signInError)}
              </Alert>
            )}
          </SignInFormContainer>
        </Fragment>
      )}
    </Fragment>
  );
};

export default SignIn;
