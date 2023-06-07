import { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import { fetchLoansStart } from '../../store/loan/loan.action';

import moment from 'moment';

import { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
  LoanImage,
  LoanImageContainer,
  LoanItemContainer,
  AllowedIcon,
  DeniedIcon,
  InProcessIcon,
  IconContainer,
  AllowButton,
  ButtonContainer,
  DenyButton,
} from './loan-item.styles';

import { updatePermissionCreditLoan } from '../../utils/firebase/firebase.utils';
import { Timestamp } from 'firebase/firestore';
import { UserData } from '../../utils/firebase/firebase.types';

export type Loan = {
  id: string;
  creditCard: string;
  displayName: string;
  email: string;
  images: string[];
  isAllowed: boolean;
  amount: number;
  tel: string;
  timestamp: Timestamp;
  userAuth: UserData;
};

const LoanItem = ({ loan, isAdmin }: { isAdmin: boolean; loan: Loan }) => {
  const dispatch = useDispatch();

  const {
    id,
    creditCard,
    displayName,
    email,
    images,
    isAllowed,
    amount,
    tel,
    timestamp,
    userAuth,
  } = loan;

  const allowCreditHandler = async () => {
    try {
      await updatePermissionCreditLoan(userAuth, loan, true);
      dispatch(fetchLoansStart());
    } catch (error: any) {
      alert(error.code);
    }
  };

  const denyCreditHandler = async () => {
    try {
      await updatePermissionCreditLoan(userAuth, loan, false);
      dispatch(fetchLoansStart());
    } catch (error: any) {
      alert(error.code);
    }
  };

  return (
    <LoanItemContainer>
      <p style={{ marginBottom: '20px' }}>
        <b>Дата оформления кредита </b>
        {moment(timestamp.toDate()).calendar().toLowerCase()}
      </p>
      <p>
        <b>Идентификатор пользователя:</b> {userAuth.id}
      </p>
      <p>
        <b>Идентификатор кредита:</b> {id}
      </p>
      <p>
        <b>Имя кредитора:</b> {displayName}
      </p>
      <p>
        <b>Кредитная карта:</b> {creditCard}
      </p>
      <p>
        <b>Запрашиваемая сумма: </b> {amount}
      </p>
      <p>
        <b>E-mail:</b> {email}
      </p>
      <p>
        <b>Номер телефона:</b> {tel}
      </p>
      <p>
        <b>Документы:</b>
      </p>
      <LoanImageContainer>
        {images.map((imageSrc, idx) => (
          <LoanImage key={idx} src={imageSrc} alt='' />
        ))}
      </LoanImageContainer>
      {isAllowed === null ? (
        <IconContainer>
          В обработке
          <InProcessIcon />
        </IconContainer>
      ) : isAllowed ? (
        <IconContainer>
          Кредит одобрен <AllowedIcon />
        </IconContainer>
      ) : (
        <IconContainer>
          Кредит не одобрен
          <DeniedIcon />
        </IconContainer>
      )}
      {isAdmin ? (
        <ButtonContainer>
          {isAllowed === null ? (
            <Fragment>
              <AllowButton
                onClick={allowCreditHandler}
                buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}
              >
                Allow
              </AllowButton>
              <DenyButton
                onClick={denyCreditHandler}
                buttonType={BUTTON_TYPE_CLASSES.arrowSubmit}
              >
                Deny
              </DenyButton>
            </Fragment>
          ) : null}
        </ButtonContainer>
      ) : null}
    </LoanItemContainer>
  );
};

export default LoanItem;