import { useAppDispatch } from '../../app/store';
import { FC, Fragment } from 'react';

import { fetchLoansStarted } from '../../features/loan/loan.slice';

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

import { updatePermissionCreditLoan } from '../../common/utils/firebase/firebase.utils';
import { LoanStore } from '../../features/loan/loan.types';
import { format } from 'date-fns';

type LoanItemProps = {
  isAdmin: boolean;
  loan: LoanStore;
};

const LoanItem: FC<LoanItemProps> = ({ loan, isAdmin }) => {
  const dispatch = useAppDispatch();

  const {
    id: loanId,
    creditCard,
    displayName,
    email,
    images,
    isAllowed,
    amount: loanAmount,
    tel,
    timestamp,
    userId,
  } = loan;

  const allowCreditHandler = async () => {
    try {
      await updatePermissionCreditLoan(userId, loanId, loanAmount, true);
      dispatch(fetchLoansStarted());
    } catch (error: any) {
      alert(error.code);
    }
  };

  const denyCreditHandler = async () => {
    try {
      await updatePermissionCreditLoan(userId, loanId, loanAmount, false);
      dispatch(fetchLoansStarted());
    } catch (error: any) {
      alert(error.code);
    }
  };

  return (
    <LoanItemContainer>
      <p style={{ marginBottom: '20px' }}>
        <b>Дата оформления кредита </b>
        {format(new Date(timestamp), 'dd.MM.yyyy')}
      </p>
      <p>
        <b>Идентификатор пользователя:</b> {userId}
      </p>
      <p>
        <b>Идентификатор кредита:</b> {loanId}
      </p>
      <p>
        <b>Имя кредитора:</b> {displayName}
      </p>
      <p>
        <b>Кредитная карта:</b> {creditCard}
      </p>
      <p>
        <b>Запрашиваемая сумма: </b> {loanAmount}
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
