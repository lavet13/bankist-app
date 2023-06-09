import { useSelector, useDispatch } from 'react-redux';

import { selectBalance } from '../../store/movement/movement.selector';
import { selectCurrentUser } from '../../store/user/user.selector';

import {
  Alert,
  AlertTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from '@mui/material';

import { TransferContainer, Title, Form } from './transfer.styles';

import {
  closeSnackbar,
  closeTransferErrorMessage,
  transferStart,
} from '../../store/transfer/transfer.action';
import {
  selectSnackbarIsOpen,
  selectTransferError,
  selectTransferIsLoading,
} from '../../store/transfer/transfer.selector';
import { Close, Send } from '@mui/icons-material';
import { getErrorMessage } from '../../utils/error/error.utils';
import { LoadingButton } from '@mui/lab';
import { Grow } from '@mui/material';
import NumberInput from '../number-input/number-input.component';
import CreditCardInput, {
  MAX_CREDIT_CARD_SIZE,
} from '../credit-card-input/credit-card-input.component';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  TRANSFER_ERROR_MESSAGES,
  getTransferCreditCardError,
} from '../../store/transfer/transfer.error';
import { SyntheticEvent } from 'react';

export type TransferDefaultValues = {
  creditCard: { value: string; formattedValue: string };
  amount: string;
};

const defaultValues: TransferDefaultValues = {
  creditCard: { value: '', formattedValue: '' },
  amount: '',
};

const Transfer = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
  });
  const dispatch = useDispatch();
  const balance = useSelector(selectBalance);
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectTransferIsLoading);
  const transferError = useSelector(selectTransferError);
  const snackbarIsOpen = useSelector(selectSnackbarIsOpen);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    console.log({ event, reason });
    if (reason === 'clickaway') {
      return;
    }

    dispatch(closeSnackbar());
  };
  const handleErrorMessage = () => dispatch(closeTransferErrorMessage());

  const onSubmit: SubmitHandler<TransferDefaultValues> = data => {
    if (isLoading) return;

    dispatch(
      transferStart({
        currentUser,
        ...data,
        reset,
      })
    );
  };

  return (
    <TransferContainer>
      <Title>Перечисление депозита</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='creditCard'
          control={control}
          rules={{
            validate: {
              required: ({ value }) =>
                !!value.length || 'Кредитная карта обязательна к заполнению!',
              unfilled: ({ value }) =>
                !(value?.length < MAX_CREDIT_CARD_SIZE) ||
                'Кредитная карта не заполнена!',
            },
          }}
          render={({
            field: {
              value: { value },
              ...other
            },
            fieldState: { error, invalid },
          }) => {
            return (
              <TextField
                {...other}
                value={(value ||= '')}
                label='Кредитная карта'
                variant='filled'
                error={
                  invalid ||
                  (!!transferError?.code &&
                    !!getTransferCreditCardError(transferError))
                }
                helperText={
                  error
                    ? error.message
                    : transferError?.code &&
                      getTransferCreditCardError(transferError)
                }
                InputProps={{ inputComponent: CreditCardInput as any }}
              />
            );
          }}
        />

        <Controller
          name='amount'
          control={control}
          rules={{
            required: 'Сумма обязательна к заполнению',
            validate: value =>
              (balance - Math.abs(+value) > 0 && Math.abs(+value) > 0) ||
              'Недостаточно средств для перевода!',
          }}
          render={({ field, fieldState: { error, invalid } }) => (
            <TextField
              {...field}
              label='Сумма'
              error={invalid}
              helperText={error ? error.message : null}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>₽</InputAdornment>
                ),
                inputComponent: NumberInput as any,
              }}
              variant='filled'
            />
          )}
        />

        <LoadingButton
          size='medium'
          sx={{ width: '100%' }}
          type='submit'
          endIcon={<Send />}
          loading={isLoading}
          loadingPosition='end'
          variant='text'
        >
          <span>Перевести</span>
        </LoadingButton>

        <Snackbar
          open={snackbarIsOpen}
          autoHideDuration={6000}
          onClose={handleClose}
          TransitionComponent={Grow}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleClose} severity='success'>
            Транзакция произведена успешно!
          </Alert>
        </Snackbar>

        {transferError &&
          !TRANSFER_ERROR_MESSAGES[
            transferError.code ? transferError.code : ''
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
              {transferError.code
                ? getErrorMessage(transferError)
                : transferError.message}
            </Alert>
          )}
      </Form>
    </TransferContainer>
  );
};

export default Transfer;
