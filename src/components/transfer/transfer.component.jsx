import { useState } from 'react';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
  TransferContainer,
  Title,
  Form,
  OperationInput,
  OperationLabel,
} from './transfer.styles';

const defaultFormFields = {
  transfer: '',
  amount: '',
};

const Transfer = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { transfer, amount } = formFields;

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
    <TransferContainer>
      <Title>Перечисление депозита</Title>
      <Form onSubmit={handleSubmit}>
        <OperationLabel htmlFor='transfer'>Перевод</OperationLabel>
        <OperationInput
          id='transfer'
          type='text'
          name='transfer'
          value={transfer}
          onChange={handleChange}
          required
        />
        <OperationLabel htmlFor='transfer-amount'>Количество</OperationLabel>
        <OperationInput
          id='transfer-amount'
          type='number'
          name='amount'
          value={amount}
          onChange={handleChange}
          required
        />
        <Button type='submit' buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}>
          →
        </Button>
      </Form>
    </TransferContainer>
  );
};

export default Transfer;