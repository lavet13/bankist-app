import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  selectLoanArray,
  selectLoanArrayIsLoading,
} from '../../store/loan/loan.selector';

import LoanItem from '../../components/loan-item/loan-item.component';
import Spinner from '../../components/spinner/spinner.component';
import { selectCurrentUser } from '../../store/user/user.selector';

const Loan = () => {
  const { id } = useParams();
  const loanArray = useSelector(selectLoanArray);
  console.log(loanArray);
  const loanArrayIsLoading = useSelector(selectLoanArrayIsLoading);
  const { admin: isAdmin } = useSelector(selectCurrentUser);

  const loan = !isAdmin
    ? loanArray.find(loan => loan.id === id)
    : loanArray
        .find(loanArray => loanArray.find(loan => loan.id === id))
        .find(loan => loan.id === id);

  console.log(loan);

  return (
    <Fragment>
      {loanArrayIsLoading ? (
        <Spinner />
      ) : loan ? (
        <LoanItem loan={loan} isAdmin={isAdmin} />
      ) : (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          Такой записи не существует
        </p>
      )}
    </Fragment>
  );
};

export default Loan;
