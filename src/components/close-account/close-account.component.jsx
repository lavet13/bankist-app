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
import {
  USER_ERROR_MESSAGES,
  getCloseAccountPasswordError,
} from '../../store/user/user.error';
import { getErrorMessage } from '../../utils/error/error.utils';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  password: '',
};

const CloseAccount = () => {
  const { control, handleSubmit, reset } = useForm({ defaultValues });
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const closeAccountIsLoading = useSelector(selectCloseAccountIsLoading);
  const closeAccountError = useSelector(selectCloseAccountError);

  const [isProviderPasswordExist, setIsProviderPasswordExist] = useState(false);
  const [providerInfo, setProviderInfo] = useState([]);

  const handleErrorMessage = () => dispatch(closeCloseAccountErrorMessage());

  const onSubmit = data => {
    const { password } = data;

    if (closeAccountIsLoading) return;

    if (auth.currentUser) {
      dispatch(
        closeAccountStart({
          currentUser: auth.currentUser,
          password: isProviderPasswordExist ? password : null,
          reset,
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

  return (
    <CloseAccountContainer>
      <Title>Закрыть аккаунт</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {isProviderPasswordExist ? (
          <Controller
            name='password'
            control={control}
            rules={{ required: 'Заполните пароль!' }}
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                {...field}
                error={
                  invalid ||
                  (closeAccountError &&
                    !!getCloseAccountPasswordError(closeAccountError))
                }
                helperText={
                  error
                    ? error.message
                    : closeAccountError &&
                      getCloseAccountPasswordError(closeAccountError)
                }
                variant='filled'
                label='Пароль'
              />
            )}
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

        {closeAccountError && !USER_ERROR_MESSAGES[closeAccountError.code] ? (
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
            {getErrorMessage(closeAccountError)}
          </Alert>
        ) : null}
      </Form>
    </CloseAccountContainer>
  );
};

export default CloseAccount;
