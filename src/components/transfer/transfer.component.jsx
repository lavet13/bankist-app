import { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectBalance } from '../../store/movement/movement.selector';
import { selectCurrentUser } from '../../store/user/user.selector';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
  TransferContainer,
  Title,
  Form,
  OperationInput,
  OperationLabel,
} from './transfer.styles';

import { transferAmountToUser } from '../../utils/firebase/firebase.utils';

const defaultFormFields = {
  email: '',
  amount: '',
};

const Transfer = () => {
  const balance = useSelector(selectBalance);
  const currentUser = useSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, amount } = formFields;

  const resetFormFields = () => setFormFields(defaultFormFields);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    if (isLoading) return;

    try {
      if (balance - amount > 0) {
        await transferAmountToUser(currentUser, email, amount);

        resetFormFields();
      } else {
        throw new Error('Недостаточно средств для перевода!');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }

    console.log(formFields);
  };

  return (
    <TransferContainer>
      <Title>Перечисление депозита</Title>
      <Form onSubmit={handleSubmit}>
        <OperationLabel htmlFor='transfer-email'>Перевод</OperationLabel>
        <OperationInput
          id='transfer-email'
          type='email'
          name='email'
          value={email}
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
        <Button
          isLoading={isLoading}
          type='submit'
          buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}
        >
          →
        </Button>
      </Form>
    </TransferContainer>
  );
};

export default Transfer;
