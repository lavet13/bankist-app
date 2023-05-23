import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectBalance } from '../../store/movement/movement.selector';
import { selectCurrentUser } from '../../store/user/user.selector';
import InputMask from 'react-input-mask';

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
import {
  getTransferAmountError,
  getTransferCreditCardError,
} from '../../store/transfer/transfer.error';
import { getErrorMessage } from '../../utils/error/error.utils';
import { LoadingButton } from '@mui/lab';
import { Grow } from '@mui/material';

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
  const snackbarIsOpen = useSelector(selectSnackbarIsOpen);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { creditCard, amount } = formFields;

  const resetFormFields = () => setFormFields(defaultFormFields);

  const handleClose = (event, reason) => {
    console.log({ event, reason });
    if (reason === 'clickaway') {
      return;
    }

    dispatch(closeSnackbar());
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

  const handleErrorMessage = () => dispatch(closeTransferErrorMessage());

  const hasUnknownError = error =>
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
          helperText={error && getTransferAmountError(error)}
          name='amount'
          value={amount}
          onChange={handleChange}
        >
          {inputProps => <TextField {...inputProps}></TextField>}
        </InputMask>

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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity='success'>
            Кредит отправлен на проверку!
          </Alert>
        </Snackbar>

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
    </TransferContainer>
  );
};

export default Transfer;
