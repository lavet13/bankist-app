import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Spinner from '../../components/spinner/spinner.component';

import {
  FormControl,
  FilledInput,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';

import {
  selectCurrentUserIsLoading,
  selectEmailSignUpIsLoading,
  selectSignUpError,
} from '../../store/user/user.selector';

import {
  getSignUpDisplayNameError,
  getSignUpEmailError,
  getSignUpPasswordError,
} from '../../store/user/user.error';

import { getErrorMessage } from '../../utils/error/error.utils';

import {
  closeSignUpErrorMessage,
  signUpStart,
} from '../../store/user/user.action';

import { SignUpContainer } from './sign-up.styles';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUp = () => {
  const dispatch = useDispatch();
  const currentUserIsLoading = useSelector(selectCurrentUserIsLoading);
  const emailSignUpIsLoading = useSelector(selectEmailSignUpIsLoading);
  const error = useSelector(selectSignUpError);

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(show => !show);
  const handleMouseDownPassword = event => event.preventDefault();
  const handleErrorMessage = () => dispatch(closeSignUpErrorMessage());

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
        displayName,
      })
    );
  };

  const hasUnknownError = error =>
    getSignUpDisplayNameError(error) ||
    getSignUpEmailError(error) ||
    getSignUpPasswordError(error);

  return (
    <Fragment>
      {currentUserIsLoading ? (
        <Spinner />
      ) : (
        <SignUpContainer onSubmit={handleSubmit}>
          <FormControl
            sx={{ m: 1, width: '40ch' }}
            variant='filled'
            error={error && !!getSignUpDisplayNameError(error)}
          >
            <InputLabel htmlFor='filled-display-name'>
              Имя пользователя
            </InputLabel>
            <FilledInput
              id='filled-display-name'
              type='text'
              name='displayName'
              value={displayName}
              onChange={handleChange}
            />
            {error && (
              <FormHelperText>
                {getSignUpDisplayNameError(error)}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl
            sx={{ m: 1, width: '40ch' }}
            variant='filled'
            error={error && !!getSignUpEmailError(error)}
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
              <FormHelperText>{getSignUpEmailError(error)}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            sx={{ m: 1, width: '40ch' }}
            variant='filled'
            error={error && !!getSignUpPasswordError(error)}
          >
            <InputLabel htmlFor='filled-adornment-password'>Пароль</InputLabel>
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
              <FormHelperText>{getSignUpPasswordError(error)}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            sx={{ m: 1, width: '40ch' }}
            variant='filled'
            error={error && !!getSignUpPasswordError(error)}
          >
            <InputLabel htmlFor='filled-adornment-confirm-password'>
              Подтвердить пароль
            </InputLabel>
            <FilledInput
              id='filled-adornment-confirm-password'
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              value={confirmPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {error && (
              <FormHelperText>{getSignUpPasswordError(error)}</FormHelperText>
            )}
          </FormControl>

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
        </SignUpContainer>
      )}
    </Fragment>
  );
};

export default SignUp;
