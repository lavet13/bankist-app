import { Fragment, useEffect, useState } from 'react';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import { auth } from '../../utils/firebase/firebase.utils';

import { CloseAccountContainer } from './close-account.styles';

import {
  Title,
  Form,
  OperationInput,
  OperationLabel,
} from '../transfer/transfer.styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeAccountStart,
  getProviderPassword,
  hasProviderPassword,
} from '../../store/user/user.action';
import {
  selectCloseAccountIsLoading,
  selectCurrentUser,
} from '../../store/user/user.selector';

const defaultFormFields = {
  password: '',
};

const CloseAccount = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const closeAccountIsLoading = useSelector(selectCloseAccountIsLoading);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { password } = formFields;

  const [isProviderPasswordExist, setIsProviderPasswordExist] = useState(false);

  const resetFormFields = () => setFormFields(defaultFormFields);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (auth.currentUser) {
      dispatch(
        closeAccountStart({
          currentUser: auth.currentUser,
          password: isProviderPasswordExist ? password : null,
          resetFormFields,
        })
      );
    }
  };

  useEffect(() => {
    if (currentUser) {
      const providerInfo = getProviderPassword(auth.currentUser);
      setIsProviderPasswordExist(hasProviderPassword(providerInfo));
    }
  }, [currentUser]);

  return (
    <CloseAccountContainer>
      <Title>Закрыть аккаунт</Title>
      <Form onSubmit={handleSubmit}>
        {isProviderPasswordExist ? (
          <Fragment>
            <OperationLabel htmlFor='close-account-password'>
              Пароль
            </OperationLabel>
            <OperationInput
              id='close-account-password'
              type='password'
              name='password'
              value={password}
              onChange={handleChange}
            />
          </Fragment>
        ) : null}

        <Button
          isLoading={closeAccountIsLoading}
          type='submit'
          buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}
        >
          →
        </Button>
      </Form>
    </CloseAccountContainer>
  );
};

export default CloseAccount;
