import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';

import { ErrorMessage, LoanContainer } from './loan.styles';

import { Title, Form } from '../transfer/transfer.styles';
import {
  Snackbar,
  Alert,
  IconButton,
  AlertTitle,
  Grow,
  TextField,
  Button,
  InputAdornment,
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
  getLoanFormAmountError,
  getLoanFormCollateralError,
  getLoanFormCreditCardError,
  getLoanFormDisplayNameError,
  getLoanFormEmailError,
  getLoanFormEmploymentError,
  getLoanFormFinancialsError,
  getLoanFormPassportPhotoError,
  getLoanFormTelephoneError,
} from '../../store/loan/loan.error';
import { Close, Send, UploadFile } from '@mui/icons-material';
import { getErrorMessage } from '../../utils/error/error.utils';
import { LoadingButton } from '@mui/lab';
import TelephoneInput from '../telephone-input/telephone-input.component';
import CreditCardInput from '../credit-card-input/credit-card-input.component';
import NumberInput from '../number-input/number-input.component';

const defaultFormFields = {
  displayName: '',
  email: '',
  tel: { value: '', formattedValue: '' },
  creditCard: '',
  amount: '',
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

  const { displayName, email, tel, creditCard, amount } = formFields;
  const { passportPhoto, employment, financials, collateral } = formFileFields;

  const resetFormField = () => {
    setFormFields(defaultFormFields);
    this.call();
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
    console.log(formFileFields);

    setFormFileFields({ ...formFileFields, [name]: files[0] });
  };

  const handleChange = event => {
    const { name, value, formattedValue } = event.target;

    if (name === 'tel')
      setFormFields({
        ...formFields,
        [name]: { value, formattedValue },
      });
    else setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const { reset } = event.target;
    console.log(formFileFields);

    if (isLoading) return;

    dispatch(
      uploadLoanStart({
        currentUser,
        formFileFields,
        formFields,
        resetForm: resetFormField.bind(reset),
      })
    );
  };

  const hasUnknownError = error =>
    getLoanFormTelephoneError(error) ||
    getLoanFormCreditCardError(error) ||
    getLoanFormDisplayNameError(error) ||
    getLoanFormEmailError(error) ||
    getLoanFormAmountError(error) ||
    getLoanFormPassportPhotoError(error) ||
    getLoanFormEmploymentError(error) ||
    getLoanFormFinancialsError(error) ||
    getLoanFormCollateralError(error);

  return (
    <LoanContainer>
      <Title>Получение кредита</Title>
      <Form onSubmit={handleSubmit}>
        <TextField
          label='ФИО *'
          error={error && !!getLoanFormDisplayNameError(error)}
          helperText={error && getLoanFormDisplayNameError(error)}
          type='text'
          name='displayName'
          value={displayName}
          onChange={handleChange}
          variant='filled'
        />

        <TextField
          label='E-mail'
          error={error && !!getLoanFormEmailError(error)}
          helperText={error && getLoanFormEmailError(error)}
          name='email'
          value={email}
          onChange={handleChange}
          variant='filled'
        />

        <TextField
          label='Номер телефона'
          error={error && !!getLoanFormTelephoneError(error)}
          helperText={error && getLoanFormTelephoneError(error)}
          variant='filled'
          type='tel'
          name='tel'
          value={tel}
          onChange={handleChange}
          InputProps={{ inputComponent: TelephoneInput }}
        />

        <TextField
          label='Номер карты'
          error={error && !!getLoanFormCreditCardError(error)}
          helperText={error && getLoanFormCreditCardError(error)}
          variant='filled'
          name='creditCard'
          value={creditCard}
          onChange={handleChange}
          InputProps={{ inputComponent: CreditCardInput }}
        />

        <TextField
          label='Сумма'
          error={error && !!getLoanFormAmountError(error)}
          helperText={error && getLoanFormAmountError(error)}
          variant='filled'
          name='amount'
          value={amount}
          onChange={handleChange}
          InputProps={{
            inputComponent: NumberInput,
            startAdornment: <InputAdornment position='start'>₽</InputAdornment>,
          }}
        />

        <Button
          component='label'
          variant='outlined'
          size='small'
          color={`${
            passportPhoto
              ? 'success'
              : !(error && getLoanFormPassportPhotoError(error))
              ? 'primary'
              : 'error'
          }`}
          startIcon={<UploadFile />}
          sx={{ marginRight: '10px', fontSize: '12px' }}
        >
          Паспорт фото
          <span></span>
          <input
            type='file'
            name='passportPhoto'
            accept='.png, .jpeg, .jpg'
            hidden
            onChange={handleFilesChange}
          />
        </Button>
        <ErrorMessage error={error && getLoanFormPassportPhotoError(error)}>
          {error && getLoanFormPassportPhotoError(error)
            ? getLoanFormPassportPhotoError(error)
            : passportPhoto?.name}
        </ErrorMessage>

        <Button
          size='small'
          component='label'
          variant='outlined'
          color={`${
            employment
              ? 'success'
              : !(error && getLoanFormEmploymentError(error))
              ? 'primary'
              : 'error'
          }`}
          startIcon={<UploadFile />}
          sx={{ marginRight: '10px', fontSize: '12px' }}
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
        <ErrorMessage error={error && getLoanFormEmploymentError(error)}>
          {error && getLoanFormEmploymentError(error)
            ? getLoanFormEmploymentError(error)
            : employment?.name}
        </ErrorMessage>

        <Button
          size='small'
          component='label'
          variant='outlined'
          color={`${
            financials
              ? 'success'
              : !(error && getLoanFormFinancialsError(error))
              ? 'primary'
              : 'error'
          }`}
          startIcon={<UploadFile />}
          sx={{ marginRight: '10px', fontSize: '12px' }}
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
        <ErrorMessage error={error && getLoanFormFinancialsError(error)}>
          {error && getLoanFormFinancialsError(error)
            ? getLoanFormFinancialsError(error)
            : financials?.name}
        </ErrorMessage>

        <Button
          size='small'
          component='label'
          variant='outlined'
          color={`${
            collateral
              ? 'success'
              : !(error && getLoanFormCollateralError(error))
              ? 'primary'
              : 'error'
          }`}
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
        <ErrorMessage error={error && getLoanFormCollateralError(error)}>
          {error && getLoanFormCollateralError(error)
            ? getLoanFormCollateralError(error)
            : collateral?.name}
        </ErrorMessage>

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
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
