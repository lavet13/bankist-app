import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import InputMask from 'react-input-mask';

import { BUTTON_TYPE_CLASSES } from '../button/button.component';

import { LoanContainer } from './loan.styles';

import {
  Title,
  OperationInput,
  Form,
  OperationLabel,
} from '../transfer/transfer.styles';
import {
  Snackbar,
  Alert,
  IconButton,
  AlertTitle,
  Grow,
  TextField,
  Button,
} from '@mui/material';
import {
  selectSnackbarIsOpen,
  selectUploadLoanError,
  selectUploadLoanIsLoading,
} from '../../store/loan/loan.selector';
import {
  closeSnackbar,
  closeUploadLoanErrorMessage,
  uploadLoanStart,
} from '../../store/loan/loan.action';
import {
  getLoanFormCreditCardError,
  getLoanFormTelephoneError,
} from '../../store/loan/loan.error';
import { Close, Send, UploadFile } from '@mui/icons-material';
import { getErrorMessage } from '../../utils/error/error.utils';
import { LoadingButton } from '@mui/lab';

const defaultFormFields = {
  displayName: '',
  email: '',
  tel: '',
  creditCard: '',
};

const defaultFormFileFields = {
  passportPhoto: null,
  employment: null,
  financials: null,
  collateral: null,
};

const LoanForm = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [formFileFields, setFormFileFields] = useState(defaultFormFileFields);

  const isLoading = useSelector(selectUploadLoanIsLoading);
  const error = useSelector(selectUploadLoanError);
  const snackbarIsOpen = useSelector(selectSnackbarIsOpen);

  const { displayName, email, tel, creditCard } = formFields;

  const resetFormField = reset => {
    setFormFields(defaultFormFields);
    reset();
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(closeSnackbar());
  };

  const handleErrorMessage = () => dispatch(closeUploadLoanErrorMessage());

  const handleFilesChange = event => {
    const { name, files } = event.target;

    setFormFileFields({ ...formFileFields, [name]: files[0] });
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (isLoading) return;

    dispatch(
      uploadLoanStart({
        currentUser,
        formFileFields,
        formFields,
        resetForm: resetFormField.bind(null, event.target.reset),
      })
    );
  };

  const hasUnknownError = error =>
    getLoanFormTelephoneError(error) || getLoanFormCreditCardError(error);

  return (
    <LoanContainer>
      <Title>Получение кредита</Title>
      <Form onSubmit={handleSubmit}>
        <TextField
          label='ФИО *'
          type='text'
          name='displayName'
          value={displayName}
          onChange={handleChange}
          variant='filled'
        />

        <TextField
          label='E-mail'
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          variant='filled'
        />

        <InputMask
          label='Номер телефона'
          variant='filled'
          type='tel'
          mask='+7 (999) 999-99-99'
          maskChar={'_'}
          name='tel'
          value={tel}
          onChange={handleChange}
        >
          {inputProps => <TextField {...inputProps} />}
        </InputMask>

        <InputMask
          label='Номер карты'
          type='text'
          mask='9999 9999 9999 9999'
          maskChar={'_'}
          name='creditCard'
          value={creditCard}
          onChange={handleChange}
          variant='filled'
        >
          {inputProps => <TextField {...inputProps} />}
        </InputMask>

        <Button
          component='label'
          variant='outlined'
          startIcon={<UploadFile />}
          sx={{ marginRight: '10px' }}
        >
          Паспорт фото
          <input
            type='file'
            name='passportPhoto'
            accept='.png, .jpeg, .jpg'
            hidden
            onChange={handleFilesChange}
          />
        </Button>

        <Button
          component='label'
          variant='outlined'
          startIcon={<UploadFile />}
          sx={{ marginRight: '10px' }}
        >
          Трудовая книжка или справка
          <input
            type='file'
            name='employment'
            onChange={handleFilesChange}
            accept='.png, .jpeg, .jpg'
            hidden
          />
        </Button>

        <Button
          component='label'
          variant='outlined'
          startIcon={<UploadFile />}
          sx={{ marginRight: '10px' }}
        >
          Выписка из банковского счета
          <input
            type='file'
            name='financials'
            onChange={handleFilesChange}
            accept='.png, .jpeg, .jpg'
            hidden
          />
        </Button>

        <Button
          component='label'
          variant='outlined'
          startIcon={<UploadFile />}
          sx={{ marginRight: '10px' }}
        >
          Документы, связанные с залогом или обеспечением кредита
          <input
            type='file'
            name='collateral'
            onChange={handleFilesChange}
            accept='.png, .jpeg, .jpg'
            hidden
          />
        </Button>

        <LoadingButton
          size='medium'
          sx={{ width: '100%' }}
          type='submit'
          endIcon={<Send />}
          loading={isLoading}
          loadingPosition='end'
          variant='text'
        >
          <span>Отправить</span>
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
      </Form>
    </LoanContainer>
  );
};

export default LoanForm;
