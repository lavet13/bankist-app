import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchMovementsStart } from '../../store/movement/movement.action';

import { selectBalance } from '../../store/movement/movement.selector';
import { selectCurrentUser } from '../../store/user/user.selector';
import InputMask from 'react-input-mask';

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
  creditCard: '',
  amount: '',
};

const Transfer = () => {
  const dispatch = useDispatch();
  const balance = useSelector(selectBalance);
  const currentUser = useSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { creditCard, amount } = formFields;

  const resetFormFields = () => setFormFields(defaultFormFields);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    if (isLoading) return;

    const creditCardNoSpaces = creditCard
      .split('')
      .filter(char => char !== ' ')
      .join('');

    try {
      if (balance - amount > 0) {
        await transferAmountToUser(currentUser, creditCardNoSpaces, amount);
        dispatch(fetchMovementsStart(currentUser));

        resetFormFields();
      } else {
        throw new Error('Недостаточно средств для перевода!');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TransferContainer>
      <Title>Перечисление депозита</Title>
      <Form onSubmit={handleSubmit}>
        <OperationLabel htmlFor='transfer-credit-card'>Перевод</OperationLabel>
        <InputMask
          id='transfer-credit-card'
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

        <OperationLabel htmlFor='transfer-amount'>Сумма (руб.)</OperationLabel>
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
