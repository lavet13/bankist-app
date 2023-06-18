import { Fragment } from 'react';
import { useAppSelector } from '../../app/store';

import {
  selectLoanArrayIsLoading,
  selectLoanArray,
} from '../../features/loan/loan.selector';

import { selectCurrentUser } from '../../features/user/user.selector';

import { Link } from 'react-router-dom';
import Spinner from '../../components/spinner/spinner.component';

import './loans-preview.styles';
import { format } from 'date-fns';
import { LoanStore } from '../../features/loan/loan.types';

const LoansPreview = () => {
  const userLoans = useAppSelector(selectLoanArray);
  const loanArrayIsLoading = useAppSelector(selectLoanArrayIsLoading);
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <Fragment>
      {loanArrayIsLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          {currentUser && !currentUser.admin
            ? (userLoans as LoanStore[]).map(loan => (
                <Link key={loan.id} to={loan.id}>
                  <p>{format(new Date(loan.timestamp), 'dd.MM.yyyy')}</p>
                </Link>
              ))
            : (userLoans as LoanStore[][]).flatMap(loanArray =>
                loanArray.map(loan => (
                  <Link key={loan.id} to={loan.id}>
                    <p>{format(new Date(loan.timestamp), 'dd.MM.yyyy')}</p>
                  </Link>
                ))
              )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoansPreview;
