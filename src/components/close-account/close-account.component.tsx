import { useEffect, useState } from 'react';

import {
  auth,
  getProvidersInfo,
  hasProviderPassword,
} from '../../utils/firebase/firebase.utils';

import { CloseAccountContainer } from './close-account.styles';

import { Title, Form } from '../transfer/transfer.styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeAccountStart,
  closeCloseAccountErrorMessage,
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
import {
  GenerateError,
  getErrorMessage,
  isErrorWithCode,
} from '../../utils/error/error.utils';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ProvidersInfo } from '../../utils/firebase/firebase.types';
import { AuthError } from 'firebase/auth';

export type CloseAccountDefaultValues = {
  password: string;
};

const defaultValues: CloseAccountDefaultValues = {
  password: '',
};

const CloseAccount = () => {
  const { control, handleSubmit, reset } = useForm({ defaultValues });
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const closeAccountIsLoading = useSelector(selectCloseAccountIsLoading);
  const closeAccountError = useSelector(selectCloseAccountError);

  const [isProviderPasswordExist, setIsProviderPasswordExist] = useState(false);
  const [providerInfo, setProviderInfo] = useState<ProvidersInfo[]>([]);

  const handleErrorMessage = () => dispatch(closeCloseAccountErrorMessage());

  const onSubmit: SubmitHandler<CloseAccountDefaultValues> = data => {
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
                  (!!closeAccountError &&
                    !!getCloseAccountPasswordError(
                      closeAccountError as GenerateError | AuthError
                    ))
                }
                helperText={
                  error
                    ? error.message
                    : closeAccountError &&
                      getCloseAccountPasswordError(
                        closeAccountError as GenerateError | AuthError
                      )
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

        {closeAccountError && isErrorWithCode(closeAccountError) ? (
          !USER_ERROR_MESSAGES[closeAccountError.code] && (
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
              {getErrorMessage(closeAccountError as AuthError)}
            </Alert>
          )
        ) : (
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
            {(closeAccountError as Error).message}
          </Alert>
        )}
      </Form>
    </CloseAccountContainer>
  );
};

export default CloseAccount;
