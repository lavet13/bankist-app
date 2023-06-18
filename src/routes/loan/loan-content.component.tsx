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
import { LoanStore } from '../../features/loan/loan.types';

type LoanContentRouteParams = {
  id: string;
};

const LoanContent = () => {
  const { id } = useParams<
    keyof LoanContentRouteParams
  >() as LoanContentRouteParams;
  const [loan, setLoan] = useState<LoanStore | undefined>(undefined);
  const loanArray = useAppSelector(selectLoanArray);
  const loanArrayIsLoading = useAppSelector(selectLoanArrayIsLoading);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (!loanArrayIsLoading && currentUser) {
      const loan = !currentUser.admin
        ? (loanArray as LoanStore[]).find(loan => loan.id === id)
        : (loanArray as LoanStore[][])
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
