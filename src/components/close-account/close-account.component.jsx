import { useState } from 'react';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
  auth,
  deleteUserAccount,
  signOutUser,
} from '../../utils/firebase/firebase.utils';

import { CloseAccountContainer } from './close-account.styles';

import {
  Title,
  Form,
  OperationInput,
  OperationLabel,
} from '../transfer/transfer.styles';

const defaultFormFields = {
  password: '',
};

const onTimeoutInvoke = (callback, seconds) =>
  new Promise(resolve =>
    setTimeout(async () => {
      await callback();
      resolve();
    }, seconds * 1000)
  );

const CloseAccount = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { password } = formFields;

  const resetFormFields = () => setFormFields(defaultFormFields);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (auth.currentUser) {
      const deleteUser = async () => {
        await deleteUserAccount(auth.currentUser);
        // await onTimeoutInvoke();
      };

      deleteUser();
    }

    console.log(formFields);
  };
  return (
    <CloseAccountContainer>
      <Title>Закрыть аккаунт</Title>
      <Form onSubmit={handleSubmit}>
        <OperationLabel htmlFor='close-account-password'>Пароль</OperationLabel>
        <OperationInput
          id='close-account-password'
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
        />
        <Button type='submit' buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}>
          →
        </Button>
      </Form>
    </CloseAccountContainer>
  );
};

export default CloseAccount;
