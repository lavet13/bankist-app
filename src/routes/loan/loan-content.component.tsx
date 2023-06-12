import { Fragment, useState, useEffect } from 'react';
import { useAppSelector } from '../../app/store';
import { useParams } from 'react-router-dom';

import {
  selectLoanArray,
  selectLoanArrayIsLoading,
} from '../../features/loan/loan.selector';

import LoanItem from '../../components/loan-item/loan-item.component';
import Spinner from '../../components/spinner/spinner.component';
import { selectCurrentUser } from '../../features/user/user.selector';
import { Loan } from '../../common/utils/firebase/firebase.types';

const LoanContent = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState<Loan | null | undefined>(null);
  const loanArray = useAppSelector(selectLoanArray);
  const loanArrayIsLoading = useAppSelector(selectLoanArrayIsLoading);
  const currentUser = useAppSelector(selectCurrentUser);

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
