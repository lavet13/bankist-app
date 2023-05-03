import { useState } from 'react';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import { LoanContainer, LoanLabel, FormLoan } from './loan.styles';

import { Title, OperationInput } from '../transfer/transfer.styles';

const Loan = () => {
  const [amount, setAmount] = useState('');

  const resetFormField = () => setAmount('');

  const handleChange = event => {
    const { value } = event.target;

    setAmount(value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    resetFormField();

    console.log({ amount });
  };
  return (
    <LoanContainer>
      <Title>Получение кредита</Title>
      <FormLoan onSubmit={handleSubmit}>
        <OperationInput
          id='amount'
          type='number'
          name='amount'
          value={amount}
          onChange={handleChange}
          required
        ></OperationInput>
        <Button type='submit' buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}>
          →
        </Button>
        <LoanLabel htmlFor='amount'>Количество</LoanLabel>
      </FormLoan>
    </LoanContainer>
  );
};

export default Loan;
