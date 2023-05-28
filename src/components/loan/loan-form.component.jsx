import { useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';

import { LoanContainer, MuiFileInputStyled } from './loan.styles';

import { Title, Form } from '../transfer/transfer.styles';
import {
  Snackbar,
  Alert,
  IconButton,
  AlertTitle,
  Grow,
  TextField,
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
import { Close, Send } from '@mui/icons-material';
import { getErrorMessage } from '../../utils/error/error.utils';
import { LoadingButton } from '@mui/lab';
import TelephoneInput from '../telephone-input/telephone-input.component';
import CreditCardInput from '../credit-card-input/credit-card-input.component';
import NumberInput from '../number-input/number-input.component';
import { createAction } from '../../utils/reducer/reducer.utils';

const defaultFormFields = {
  displayName: '',
  email: '',
  tel: { value: '', formattedValue: '' },
  creditCard: '',
  amount: '',
};

const INITIAL_FILES_STATE = {
  passportPhoto: null,
  employment: null,
  financials: null,
  collateral: null,
};

const FILES_ACTION_TYPES = {
  SET_PASSPORT_PHOTO: 'SET_PASSPORT_PHOTO',
  SET_EMPLOYMENT: 'SET_EMPLOYMENT',
  SET_FINANCIALS: 'SET_FINANCIALS',
  COLLATERAL: 'COLLATERAL',
};

const fileReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case FILES_ACTION_TYPES.SET_PASSPORT_PHOTO:
      return { ...state, passportPhoto: payload };

    case FILES_ACTION_TYPES.SET_EMPLOYMENT:
      return { ...state, employment: payload };

    case FILES_ACTION_TYPES.SET_FINANCIALS:
      return { ...state, financials: payload };

    case FILES_ACTION_TYPES.COLLATERAL:
      return { ...state, collateral: payload };

    default:
      throw new Error(`Unhandled type of ${type} in loanReducer`);
  }
};

const LoanForm = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [files, dispatchFile] = useReducer(fileReducer, INITIAL_FILES_STATE);

  const isLoading = useSelector(selectUploadLoanIsLoading);
  const error = useSelector(selectUploadLoanError);
  const snackbarIsOpen = useSelector(selectSnackbarIsOpen);

  const { displayName, email, tel, creditCard, amount } = formFields;
  const { passportPhoto, employment, financials, collateral } = files;

  const resetFormField = () => setFormFields(defaultFormFields);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(closeSnackbar());
  };

  const handleErrorMessage = () => dispatch(closeUploadLoanErrorMessage());

  const handlePassportPhotoChange = value =>
    dispatchFile(createAction(FILES_ACTION_TYPES.SET_PASSPORT_PHOTO, value));

  const handleEmploymentChange = value =>
    dispatchFile(createAction(FILES_ACTION_TYPES.SET_EMPLOYMENT, value));

  const handleFinancialsChange = value =>
    dispatchFile(createAction(FILES_ACTION_TYPES.SET_FINANCIALS, value));

  const handleCollateralChange = value =>
    dispatchFile(createAction(FILES_ACTION_TYPES.COLLATERAL, value));

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
    console.log(files);

    if (isLoading) return;

    dispatch(
      uploadLoanStart({
        currentUser,
        files,
        formFields,
        resetFormField,
      })
    );

    event.target.reset();
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

        <MuiFileInputStyled
          value={passportPhoto}
          onChange={handlePassportPhotoChange}
          placeholder='Паспорт фото'
        />

        <MuiFileInputStyled
          value={employment}
          onChange={handleEmploymentChange}
          placeholder='Трудовая книжка или справка'
        />

        <MuiFileInputStyled
          value={financials}
          onChange={handleFinancialsChange}
          placeholder='Выписка из банковского счета'
        />

        <MuiFileInputStyled
          value={collateral}
          onChange={handleCollateralChange}
          placeholder='Документы, связанные с залогом или обеспечением кредита'
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
