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
import { Close, Send } from '@mui/icons-material';
import {
  getErrorMessage,
  isErrorWithCode,
} from '../../utils/error/error.utils';
import { LoadingButton } from '@mui/lab';
import TelephoneInput, {
  MAX_TEL_SIZE,
} from '../telephone-input/telephone-input.component';
import CreditCardInput, {
  MAX_CREDIT_CARD_SIZE,
} from '../credit-card-input/credit-card-input.component';
import NumberInput from '../number-input/number-input.component';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SyntheticEvent } from 'react';
import { AuthError } from 'firebase/auth';

export type FileFields = {
  passportPhoto?: File | null;
  employment?: File | null;
  financials?: File | null;
  collateral?: File | null;
};

export type FormFields = {
  displayName: string;
  email: string;
  tel: { value: string; formattedValue: string };
  creditCard: { value: string; formattedValue: string };
  amount: string;
};

export type LoanDefaultValues = FormFields & { fileFields: FileFields };

const defaultValues: LoanDefaultValues = {
  displayName: '',
  email: '',
  tel: { value: '', formattedValue: '' },
  creditCard: { value: '', formattedValue: '' },
  amount: '',

  fileFields: {
    passportPhoto: null,
    employment: null,
    financials: null,
    collateral: null,
  },
};

const LoanForm = () => {
  const { control, handleSubmit, reset } = useForm<LoanDefaultValues>({
    defaultValues,
  });
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const isLoading = useSelector(selectUploadLoanIsLoading);
  const error = useSelector(selectUploadLoanError);
  const snackbarIsOpen = useSelector(selectSnackbarIsOpen);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(closeSnackbar());
  };

  const handleErrorMessage = () => dispatch(closeUploadLoanErrorMessage());

  const onSubmit: SubmitHandler<LoanDefaultValues> = data => {
    if (isLoading || !currentUser) return;
    const { fileFields, ...fields } = data;

    dispatch(
      uploadLoanStart({
        currentUser,
        fields,
        fileFields,
        reset,
      })
    );

    console.log(data);
  };

  return (
    <LoanContainer>
      <Title>Получение кредита</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='displayName'
          control={control}
          rules={{
            validate: {
              unfilled: v => !!v.length || 'Имя пользователя не заполнено!',
            },
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label='ФИО *'
              error={invalid}
              helperText={error?.type === 'unfilled' ? error.message : null}
              variant='filled'
            />
          )}
        />

        <Controller
          name='email'
          control={control}
          rules={{
            validate: {
              emailMatch: v =>
                v.match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ) || 'Неверный формат E-mail',
            },
          }}
          render={({ field, fieldState: { error, invalid } }) => (
            <TextField
              {...field}
              label='E-mail'
              error={invalid}
              helperText={error?.type === 'emailMatch' ? error.message : null}
              variant='filled'
            />
          )}
        />

        <Controller
          name='tel'
          control={control}
          rules={{
            validate: {
              telMatch: ({ value }) =>
                !(value?.length < MAX_TEL_SIZE) || 'Телефон не заполнен!',
            },
          }}
          render={({
            field: {
              value: { value },
              ...other
            },
            fieldState: { invalid, error },
          }) => {
            return (
              <TextField
                {...other}
                value={(value ||= '')}
                label='Номер телефона'
                error={invalid}
                helperText={error?.type === 'telMatch' ? error.message : null}
                variant='filled'
                type='tel'
                InputProps={{ inputComponent: TelephoneInput as any }}
              />
            );
          }}
        />

        <Controller
          name='creditCard'
          control={control}
          rules={{
            validate: ({ value }) =>
              !(value?.length < MAX_CREDIT_CARD_SIZE) ||
              'Кредитная карта не заполнена!',
          }}
          render={({
            field: {
              value: { value },
              ...other
            },
            fieldState: { invalid, error },
          }) => (
            <TextField
              {...other}
              value={(value ||= '')}
              label='Номер карты'
              error={invalid}
              helperText={error?.type === 'validate' ? error.message : null}
              variant='filled'
              InputProps={{ inputComponent: CreditCardInput as any }}
            />
          )}
        />

        <Controller
          name='amount'
          control={control}
          rules={{
            validate: value =>
              !(+value <= 0) || 'Сумма должна быть больше нуля',
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label='Сумма'
              error={invalid}
              helperText={error?.type === 'validate' ? error.message : null}
              variant='filled'
              InputProps={{
                inputComponent: NumberInput as any,
                startAdornment: (
                  <InputAdornment position='start'>₽</InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name='fileFields.passportPhoto'
          control={control}
          rules={{ required: 'Не заполнено!' }}
          render={({
            field: { ref, ...other },
            fieldState: { invalid, error },
          }) => (
            <MuiFileInputStyled
              {...other}
              inputRef={ref}
              error={invalid}
              helperText={error?.type === 'required' ? error.message : null}
              placeholder='Паспорт фото'
            />
          )}
        />

        <Controller
          name='fileFields.employment'
          control={control}
          rules={{ required: 'Не заполнено!' }}
          render={({
            field: { ref, ...other },
            fieldState: { invalid, error },
          }) => (
            <MuiFileInputStyled
              {...other}
              inputRef={ref}
              error={invalid}
              helperText={error?.type === 'required' ? error.message : null}
              placeholder='Трудовая книжка или справка'
            />
          )}
        />

        <Controller
          name='fileFields.financials'
          control={control}
          rules={{ required: 'Не заполнено!' }}
          render={({
            field: { ref, ...other },
            fieldState: { invalid, error },
          }) => (
            <MuiFileInputStyled
              {...other}
              inputRef={ref}
              error={invalid}
              helperText={error?.type === 'required' ? error.message : null}
              placeholder='Выписка из банковского счета'
            />
          )}
        />

        <Controller
          name='fileFields.collateral'
          control={control}
          rules={{ required: 'Не заполнено!' }}
          render={({
            field: { ref, ...other },
            fieldState: { invalid, error },
          }) => (
            <MuiFileInputStyled
              {...other}
              inputRef={ref}
              error={invalid}
              helperText={error?.type === 'required' ? error.message : null}
              placeholder='Документы, связанные с залогом или обеспечением кредита'
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
          <span>Отправить</span>
        </LoadingButton>

        {error && isErrorWithCode(error) && (
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
            {isErrorWithCode(error)
              ? getErrorMessage(error as AuthError)
              : (error as Error).message}
          </Alert>
        )}

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
