import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  selectLoanArray,
  selectLoanArrayIsLoading,
} from '../../store/loan/loan.selector';

import LoanItem from '../../components/loan-item/loan-item.component';
import Spinner from '../../components/spinner/spinner.component';
import { selectCurrentUser } from '../../store/user/user.selector';
import { Loan } from '../../utils/firebase/firebase.types';

const LoanContent = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState<Loan | null | undefined>(null);
  const loanArray = useSelector(selectLoanArray);
  const loanArrayIsLoading = useSelector(selectLoanArrayIsLoading);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!loanArrayIsLoading && currentUser) {
      const loan = !currentUser.admin
        ? (loanArray as Loan[]).find(loan => loan.id === id)
        : (loanArray as Loan[][])
            .find(loanArray => loanArray.find(loan => loan.id === id))
            ?.find(loan => loan.id === id);

      setLoan(loan);
    }
  }, [loanArrayIsLoading]);

  return (
    <Fragment>
      {loanArrayIsLoading ? (
        <Spinner />
      ) : loan ? (
        <LoanItem loan={loan} isAdmin={!!currentUser && currentUser.admin} />
      ) : (
        <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
          Такой записи не существует
        </p>
      )}
    </Fragment>
  );
};

export default LoanContent;
