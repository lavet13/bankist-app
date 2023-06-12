import { Fragment, useState } from 'react';
import { useAppSelector } from '../../store/store';
import { useDispatch } from 'react-redux';

import Spinner from '../../components/spinner/spinner.component';

import {
  IconButton,
  InputAdornment,
  Alert,
  AlertTitle,
  TextField,
} from '@mui/material';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';

import {
  selectCurrentUserIsLoading,
  selectEmailSignUpIsLoading,
  selectSignInError,
  selectSignUpError,
} from '../../store/user/user.selector';

import {
  USER_ERROR_MESSAGES,
  getSignUpEmailError,
  getSignUpPasswordError,
} from '../../store/user/user.error';

import { getErrorMessage } from '../../utils/error/error.utils';

import {
  signUpStarted,
  signInErrorMessageClosed,
  signUpErrorMessageClosed,
} from '../../store/user/user.reducer';

import { SignUpContainer } from './sign-up.styles';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

export type SignUpDefaultValues = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const defaultValues = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUp = () => {
  const { control, handleSubmit } = useForm<SignUpDefaultValues>({
    defaultValues,
  });
  const dispatch = useDispatch();
  const currentUserIsLoading = useAppSelector(selectCurrentUserIsLoading);
  const emailSignUpIsLoading = useAppSelector(selectEmailSignUpIsLoading);
  const signUpError = useAppSelector(selectSignUpError);
  const signInError = useAppSelector(selectSignInError);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(show => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => event.preventDefault();
  const handleSignUpErrorMessage = () => dispatch(signUpErrorMessageClosed());
  const handleSignInErrorMessage = () => dispatch(signInErrorMessageClosed());

  const onSubmit: SubmitHandler<SignUpDefaultValues> = data => {
    if (emailSignUpIsLoading) return;

    const { email, password, confirmPassword, displayName } = data;

    dispatch(
      signUpStarted({
        email,
        password,
        confirmPassword,
        displayName,
      })
    );
  };

  return (
    <Fragment>
      {currentUserIsLoading ? (
        <Spinner />
      ) : (
        <SignUpContainer onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='displayName'
            control={control}
            rules={{ required: 'Имя пользователя не указано!' }}
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                {...field}
                label='Имя пользователя'
                sx={{ m: 1, width: '40ch' }}
                variant='filled'
                error={invalid}
                helperText={error ? error.message : null}
              />
            )}
          />

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
                sx={{ m: 1, width: '40ch' }}
                variant='filled'
                error={
                  invalid ||
                  (!!signUpError?.code && !!getSignUpEmailError(signUpError))
                }
                helperText={
                  error
                    ? error.message
                    : !!signUpError?.code && getSignUpEmailError(signUpError)
                }
              />
            )}
          />

          <Controller
            name='password'
            control={control}
            rules={{
              required: 'Обязательно к заполнению!',
              validate: value =>
                value.length >= 6 ||
                'Пароль должен составлять как минимум 6 символов',
            }}
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                {...field}
                label='Пароль'
                sx={{ m: 1, width: '40ch' }}
                variant='filled'
                type={showPassword ? 'text' : 'password'}
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
                error={
                  invalid ||
                  (!!signUpError?.code && !!getSignUpPasswordError(signUpError))
                }
                helperText={
                  error
                    ? error.message
                    : !!signUpError?.code && getSignUpPasswordError(signUpError)
                }
              />
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            rules={{
              required: 'Обязательно к заполнению!',
              validate: value =>
                value.length >= 6 ||
                'Пароль должен составлять как минимум 6 символов',
            }}
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                {...field}
                label='Подтвердить пароль'
                sx={{ m: 1, width: '40ch' }}
                variant='filled'
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  invalid ||
                  (!!signUpError?.code && !!getSignUpPasswordError(signUpError))
                }
                helperText={
                  error
                    ? error.message
                    : !!signUpError?.code && getSignUpPasswordError(signUpError)
                }
              />
            )}
          />

          <LoadingButton
            sx={{ m: 1, width: '40ch' }}
            size='large'
            type='submit'
            variant='contained'
            color='primary'
            loading={emailSignUpIsLoading}
          >
            Зарегестрироваться
          </LoadingButton>

          {signUpError &&
            !USER_ERROR_MESSAGES[signUpError.code ? signUpError.code : ''] && (
              <Alert
                action={
                  <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={handleSignUpErrorMessage}
                  >
                    <Close fontSize='inherit' />
                  </IconButton>
                }
                severity='error'
                sx={{ margin: '0 auto', width: '90%' }}
              >
                <AlertTitle>Ошибка</AlertTitle>
                {signUpError.code
                  ? getErrorMessage(signUpError)
                  : signUpError.message}
              </Alert>
            )}

          {signInError &&
            !USER_ERROR_MESSAGES[signInError.code ? signInError.code : ''] && (
              <Alert
                action={
                  <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={handleSignInErrorMessage}
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
        </SignUpContainer>
      )}
    </Fragment>
  );
};

export default SignUp;
