import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import InputMask from 'react-input-mask';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import { LoanContainer } from './loan.styles';

import { Timestamp } from 'firebase/firestore';

import {
  Title,
  OperationInput,
  Form,
  OperationLabel,
} from '../transfer/transfer.styles';
import { uploadInfoForLoan } from '../../utils/firebase/firebase.utils';

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

const Loan = () => {
  const currentUser = useSelector(selectCurrentUser);

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [formFileFields, setFormFileFields] = useState(defaultFormFileFields);
  const [isLoading, setIsLoading] = useState(false);

  const { displayName, email, tel, creditCard } = formFields;

  const resetFormField = () => setFormFields(defaultFormFields);

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
    console.log('submitted');
    const { tel, creditCard } = formFields;
    if (tel.length < '+7 (999) 999-99-99'.length) return;
    if (creditCard < '9999 9999 9999 9999'.length) return;
    if (isLoading) return;

    setIsLoading(true);

    console.log(formFields);
    console.log(formFileFields);

    try {
      const result = await uploadInfoForLoan(
        currentUser,
        formFileFields,
        formFields
      );

      console.log(result.data());

      resetFormField();
      event.target.reset();
    } catch (error) {
      switch (error.code) {
        default:
          console.log(error);
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoanContainer>
      <Title>Получение кредита</Title>
      <Form onSubmit={handleSubmit}>
        <OperationLabel htmlFor='loan-name'>ФИО</OperationLabel>
        <OperationInput
          id='loan-name'
          type='text'
          name='displayName'
          value={displayName}
          onChange={handleChange}
          required
        />

        <OperationLabel htmlFor='loan-email'>E-mail</OperationLabel>
        <OperationInput
          id='loan-email'
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          required
        />

        <OperationLabel htmlFor='loan-tel'>Номер телефона</OperationLabel>
        <InputMask
          id='loan-tel'
          type='tel'
          mask='+7 (999) 999-99-99'
          maskChar={null}
          name='tel'
          value={tel}
          onChange={handleChange}
          required
        >
          {inputProps => <OperationInput {...inputProps} />}
        </InputMask>

        <OperationLabel htmlFor='loan-credit-card'>Номер карты</OperationLabel>
        <InputMask
          id='loan-credit-card'
          type='text'
          mask='9999 9999 9999 9999'
          maskChar={null}
          name='creditCard'
          value={creditCard}
          onChange={handleChange}
          required
        >
          {inputProps => <OperationInput {...inputProps} />}
        </InputMask>

        <OperationLabel htmlFor='loan-passport'>
          Паспорт или иной документ, удостоверяющий личность
        </OperationLabel>
        <OperationInput
          id='loan-passport'
          type='file'
          name='passportPhoto'
          onChange={handleFilesChange}
          accept='image/*,.pdf'
          required
        />

        <OperationLabel htmlFor='loan-employment'>
          Трудовая книжка или справка
        </OperationLabel>
        <OperationInput
          id='loan-employment'
          type='file'
          name='employment'
          onChange={handleFilesChange}
          accept='image/*,.pdf'
          required
        />

        <OperationLabel htmlFor='loan-financials'>
          Выписка из банковского счета или другие документы, подтверждающие
          финансовую состоятельность
        </OperationLabel>
        <OperationInput
          id='loan-financials'
          type='file'
          name='financials'
          onChange={handleFilesChange}
          accept='image/*,.pdf'
          required
        />

        <OperationLabel htmlFor='loan-collateral'>
          Документы, связанные с залогом или обеспечением кредита
        </OperationLabel>
        <OperationInput
          id='loan-collateral'
          type='file'
          name='collateral'
          onChange={handleFilesChange}
          accept='image/*,.pdf'
          required
        />

        <Button
          isLoading={isLoading}
          type='submit'
          buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}
        >
          <span>→</span>
        </Button>
      </Form>
    </LoanContainer>
  );
};

export default Loan;
