import { Fragment } from 'react';
import { useSelector } from 'react-redux';

import {
  selectLoanArrayIsLoading,
  selectLoanArray,
} from '../../store/loan/loan.selector';

import { selectCurrentUser } from '../../store/user/user.selector';

import { Link } from 'react-router-dom';
import Spinner from '../../components/spinner/spinner.component';

import './loans-preview.styles';
import moment from 'moment';
import { Loan } from '../../utils/firebase/firebase.types';

const LoansPreview = () => {
  const userLoans = useSelector(selectLoanArray);
  const loanArrayIsLoading = useSelector(selectLoanArrayIsLoading);
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Fragment>
      {loanArrayIsLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          {currentUser && !currentUser.admin
            ? (userLoans as Loan[]).map(loan => (
                <Link key={loan.id} to={loan.id}>
                  <p>{moment(loan.timestamp.toDate()).calendar()}</p>
                </Link>
              ))
            : (userLoans as Loan[][]).flatMap(loanArray =>
                loanArray.map(loan => (
                  <Link key={loan.id} to={loan.id}>
                    <p>{moment(loan.timestamp.toDate()).calendar()}</p>
                  </Link>
                ))
              )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoansPreview;
