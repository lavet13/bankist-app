import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
  selectSignUpError,
} from '../../store/user/user.selector';

import {
  USER_ERROR_MESSAGES,
  getSignUpEmailError,
  getSignUpPasswordError,
} from '../../store/user/user.error';

import { getErrorMessage } from '../../utils/error/error.utils';

import {
  closeSignUpErrorMessage,
  signUpStart,
} from '../../store/user/user.action';

import { SignUpContainer } from './sign-up.styles';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUp = () => {
  const { control, handleSubmit } = useForm({ defaultValues });
  const dispatch = useDispatch();
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);
  const emailSignUpIsLoading = useSelector(selectEmailSignUpIsLoading);
  const signUpError = useSelector(selectSignUpError);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(show => !show);
  const handleMouseDownPassword = event => event.preventDefault();
  const handleErrorMessage = () => dispatch(closeSignUpErrorMessage());

  const onSubmit = data => {
    if (emailSignUpIsLoading) return;

    const { email, password, confirmPassword, displayName } = data;

    dispatch(
      signUpStart({
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
                  invalid || (signUpError && !!getSignUpEmailError(signUpError))
                }
                helperText={
                  error
                    ? error.message
                    : signUpError && getSignUpEmailError(signUpError)
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
                  (signUpError && !!getSignUpPasswordError(signUpError))
                }
                helperText={
                  error
                    ? error.message
                    : signUpError && getSignUpPasswordError(signUpError)
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
                  (signUpError && !!getSignUpPasswordError(signUpError))
                }
                helperText={
                  error
                    ? error.message
                    : signUpError && getSignUpPasswordError(signUpError)
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

          {signUpError && !USER_ERROR_MESSAGES[signUpError.code] && (
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
              {getErrorMessage(signUpError)}
            </Alert>
          )}
        </SignUpContainer>
      )}
    </Fragment>
  );
};

export default SignUp;
