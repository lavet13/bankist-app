import { useEffect, useState } from 'react';

import { auth } from '../../utils/firebase/firebase.utils';

import { CloseAccountContainer } from './close-account.styles';

import { Title, Form } from '../transfer/transfer.styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeAccountStart,
  closeCloseAccountErrorMessage,
  getProvidersInfo,
  hasProviderPassword,
} from '../../store/user/user.action';
import {
  selectCloseAccountError,
  selectCloseAccountIsLoading,
  selectCurrentUser,
} from '../../store/user/user.selector';
import { LoadingButton } from '@mui/lab';
import { Close, NoAccounts } from '@mui/icons-material';
import { Alert, AlertTitle, IconButton, TextField } from '@mui/material';
import { getCloseAccountPasswordError } from '../../store/user/user.error';
import { getErrorMessage } from '../../utils/error/error.utils';

const defaultFormFields = {
  password: '',
};

const CloseAccount = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const closeAccountIsLoading = useSelector(selectCloseAccountIsLoading);
  const error = useSelector(selectCloseAccountError);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { password } = formFields;

  const [isProviderPasswordExist, setIsProviderPasswordExist] = useState(false);
  const [providerInfo, setProviderInfo] = useState([]);

  const resetFormFields = () => setFormFields(defaultFormFields);
  const handleErrorMessage = () => dispatch(closeCloseAccountErrorMessage());

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (closeAccountIsLoading) return;

    if (auth.currentUser) {
      dispatch(
        closeAccountStart({
          currentUser: auth.currentUser,
          password: isProviderPasswordExist ? password : null,
          resetFormFields,
        })
      );
    }
  };

  useEffect(() => {
    if (currentUser) {
      const providerInfo = getProvidersInfo(auth.currentUser);
      setIsProviderPasswordExist(hasProviderPassword(providerInfo));
      setProviderInfo(providerInfo);
    }
  }, [currentUser]);

  const hasUnknownError = error => getCloseAccountPasswordError(error);

  return (
    <CloseAccountContainer>
      <Title>Закрыть аккаунт</Title>
      <Form onSubmit={handleSubmit}>
        {isProviderPasswordExist ? (
          <TextField
            error={error && !!getCloseAccountPasswordError(error)}
            helperText={error && getCloseAccountPasswordError(error)}
            variant='filled'
            label='Пароль'
            name='password'
            value={password}
            onChange={handleChange}
          />
        ) : null}

        {isProviderPasswordExist && (
          <LoadingButton
            type='submit'
            variant='text'
            size='small'
            startIcon={<NoAccounts />}
            loadingPosition='center'
            loading={closeAccountIsLoading}
          >
            Подтвердить
          </LoadingButton>
        )}

        {!isProviderPasswordExist &&
          providerInfo
            .filter(({ providerId }) => providerId !== 'password')
            .map(({ providerId }) => (
              <LoadingButton
                key={providerId}
                variant='text'
                size='small'
                startIcon={<NoAccounts />}
                loadingPosition='start'
                loading={closeAccountIsLoading}
              >
                Подтвердить {`при помощи ${providerId}`}
              </LoadingButton>
            ))}

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
      </Form>
    </CloseAccountContainer>
  );
};

export default CloseAccount;
