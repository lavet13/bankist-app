import { Fragment } from 'react';
import { useSelector } from 'react-redux';

import {
  selectLoanArrayIsLoading,
  selectLoanArray,
} from '../../store/loan/loan.selector';

import { Link } from 'react-router-dom';
import Spinner from '../../components/spinner/spinner.component';

import './loans-preview.styles';
import moment from 'moment';

const LoansPreview = () => {
  const userLoans = useSelector(selectLoanArray);
  const loanArrayIsLoading = useSelector(selectLoanArrayIsLoading);

  return (
    <Fragment>
      {loanArrayIsLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          {userLoans.map(loan => (
            <Link key={loan.id} to={loan.id}>
              <p>{moment(loan.timestamp.toDate()).calendar()}</p>
            </Link>
          ))}
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoansPreview;
