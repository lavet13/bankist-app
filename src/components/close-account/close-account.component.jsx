import { useState } from 'react';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import { CloseAccountContainer } from './close-account.styles';

import {
  Title,
  Form,
  OperationInput,
  OperationLabel,
} from '../transfer/transfer.styles';

const defaultFormFields = {
  user: '',
  pin: '',
};

const CloseAccount = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { user, pin } = formFields;

  const resetFormFields = () => setFormFields(defaultFormFields);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    resetFormFields();

    console.log(formFields);
  };
  return (
    <CloseAccountContainer>
      <Title>Закрыть аккаунт</Title>
      <Form onSubmit={handleSubmit}>
        <OperationInput
          id='user'
          type='text'
          name='user'
          value={user}
          onChange={handleChange}
          required
        ></OperationInput>
        <OperationInput
          id='pin'
          type='number'
          name='pin'
          value={pin}
          onChange={handleChange}
          maxLength={4}
          required
        />
        <Button type='submit' buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}>
          →
        </Button>
        <OperationLabel htmlFor='user'>Пользователь</OperationLabel>
        <OperationLabel htmlFor='pin'>PIN</OperationLabel>
      </Form>
    </CloseAccountContainer>
  );
};

export default CloseAccount;
