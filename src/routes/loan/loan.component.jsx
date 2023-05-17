import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  selectLoanArray,
  selectLoanArrayIsLoading,
} from '../../store/loan/loan.selector';

import LoanItem from '../../components/loan-item/loan-item.component';
import Spinner from '../../components/spinner/spinner.component';

const Loan = () => {
  const { id } = useParams();
  const loanArray = useSelector(selectLoanArray);
  const loanArrayIsLoading = useSelector(selectLoanArrayIsLoading);

  const loan = loanArray.find(loan => loan.id === id);

  return (
    <Fragment>
      {loanArrayIsLoading ? (
        <Spinner />
      ) : loan ? (
        <LoanItem loan={loan} />
      ) : (
        <p>Нету соответствующей записи</p>
      )}
    </Fragment>
  );
};

export default Loan;
