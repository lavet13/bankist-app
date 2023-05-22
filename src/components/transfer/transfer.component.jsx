import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectBalance } from '../../store/movement/movement.selector';
import { selectCurrentUser } from '../../store/user/user.selector';
import InputMask from 'react-input-mask';

import { Alert, InputAdornment, Snackbar, TextField } from '@mui/material';

import {
  TransferContainer,
  Title,
  Form,
  TransferButton,
} from './transfer.styles';

import { transferStart } from '../../store/transfer/transfer.action';
import {
  selectTransferError,
  selectTransferIsLoading,
} from '../../store/transfer/transfer.selector';
import { Send } from '@mui/icons-material';

const defaultFormFields = {
  creditCard: '',
  amount: '',
};

const Transfer = () => {
  const dispatch = useDispatch();
  const balance = useSelector(selectBalance);
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectTransferIsLoading);
  const error = useSelector(selectTransferError);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [open, setOpen] = useState(false);
  const { creditCard, amount } = formFields;

  const resetFormFields = () => setFormFields(defaultFormFields);

  const handleClose = (event, reason) => {
    console.log({ event, reason });
    if (reason === 'clickaway') {
      return;
    }
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (isLoading) return;

    const creditCardNoSpaces = creditCard
      .split('')
      .filter(char => char !== ' ')
      .join('');

    dispatch(
      transferStart({
        currentUser,
        creditCard: creditCardNoSpaces,
        amount,
        balance,
        resetFormFields,
      })
    );
  };

  const getTransferAmountError = error => {
    switch (error.code) {
      case 'transfer/not-enough-cash':
        return error.message;

      default:
        return null;
    }
  };

  const getTransferCreditCardError = error => {
    switch (error.code) {
      case 'transfer/credit-card-not-found':
        return error.message;

      case 'transfer/cannot-transfer-yourself':
        return error.message;

      default:
        return null;
    }
  };

  const hasUnknownErrors = error =>
    getTransferAmountError(error) || getTransferCreditCardError(error);

  return (
    <TransferContainer>
      <Title>Перечисление депозита</Title>
      <Form onSubmit={handleSubmit}>
        <InputMask
          type='text'
          label='Кредитная карта'
          variant='filled'
          helperText={error && getTransferCreditCardError(error)}
          mask='9999 9999 9999 9999'
          error={error && !!getTransferCreditCardError(error)}
          maskChar={null}
          name='creditCard'
          value={creditCard}
          onChange={handleChange}
        >
          {inputProps => <TextField {...inputProps} />}
        </InputMask>

        <InputMask
          id='transfer-amount'
          label='Сумма'
          InputProps={{
            startAdornment: <InputAdornment position='start'>₽</InputAdornment>,
          }}
          mask='999999999'
          maskChar={null}
          variant='filled'
          type='text'
          error={error && !!getTransferAmountError(error)}
          name='amount'
          value={amount}
          onChange={handleChange}
        >
          {inputProps => <TextField {...inputProps}></TextField>}
        </InputMask>

        <TransferButton
          size='medium'
          sx={{ width: '100%' }}
          type='submit'
          endIcon={<Send />}
          loading={isLoading}
          loadingPosition='end'
          variant='text'
        >
          <span>Перевести</span>
        </TransferButton>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity='success'>
            Кредит отправлен на проверку!
          </Alert>
        </Snackbar>
      </Form>
    </TransferContainer>
  );
};

export default Transfer;
