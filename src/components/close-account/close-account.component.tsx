import { useEffect, useState } from 'react';

import {
  auth,
  getProvidersInfo,
  hasProviderPassword,
} from '../../common/utils/firebase/firebase.utils';

import { CloseAccountContainer } from './close-account.styles';

import { Title, Form } from '../transfer/transfer.styles';
import { useDispatch } from 'react-redux';
import {
  closeAccountStarted,
  closeAccountErrorMessageClosed,
} from '../../features/user/user.slice';
import {
  selectCloseAccountError,
  selectCloseAccountIsLoading,
  selectCurrentUser,
} from '../../features/user/user.selector';
import { LoadingButton } from '@mui/lab';
import { Close, NoAccounts } from '@mui/icons-material';
import { Alert, AlertTitle, IconButton, TextField } from '@mui/material';
import {
  USER_ERROR_MESSAGES,
  getCloseAccountPasswordError,
} from '../../features/user/user.error';
import { getErrorMessage } from '../../common/utils/error/error.utils';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ProvidersInfo } from '../../common/utils/firebase/firebase.types';
import { useAppSelector } from '../../app/store';

export type CloseAccountDefaultValues = {
  password: string;
};

const defaultValues: CloseAccountDefaultValues = {
  password: '',
};

const CloseAccount = () => {
  const { control, handleSubmit, reset } = useForm({ defaultValues });
  const dispatch = useDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const closeAccountIsLoading = useAppSelector(selectCloseAccountIsLoading);
  const closeAccountError = useAppSelector(selectCloseAccountError);

  const [isProviderPasswordExist, setIsProviderPasswordExist] = useState(false);
  const [providerInfo, setProviderInfo] = useState<ProvidersInfo[]>([]);

  const handleErrorMessage = () => dispatch(closeAccountErrorMessageClosed());

  const onSubmit: SubmitHandler<CloseAccountDefaultValues> = data => {
    const { password } = data;

    if (closeAccountIsLoading) return;

    if (auth.currentUser) {
      dispatch(
        closeAccountStarted({
          currentUser: auth.currentUser,
          password: isProviderPasswordExist ? password : null,
          reset,
        })
      );
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
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
                  (!!closeAccountError?.code &&
                    !!getCloseAccountPasswordError(closeAccountError))
                }
                helperText={
                  error
                    ? error.message
                    : closeAccountError?.code &&
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

        {closeAccountError &&
          !USER_ERROR_MESSAGES[
            closeAccountError.code ? closeAccountError.code : ''
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
              {closeAccountError.code
                ? getErrorMessage(closeAccountError)
                : closeAccountError.message}
            </Alert>
          )}
      </Form>
    </CloseAccountContainer>
  );
};

export default CloseAccount;
