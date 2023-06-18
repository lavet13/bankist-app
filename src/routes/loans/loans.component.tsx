import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Routes, Route } from 'react-router-dom';

import {
  fetchLoanStarted,
  fetchLoansStarted,
} from '../../features/loan/loan.slice';

import { selectCurrentUser } from '../../features/user/user.selector';

import LoansPreview from '../loans-preview/loans-preview.component';
import LoanContent from '../loan/loan-content.component';

const Loans = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser && !currentUser.admin)
      dispatch(fetchLoanStarted(currentUser.id));
    else if (currentUser && currentUser.admin) dispatch(fetchLoansStarted());
  }, [currentUser]);

  return (
    <Routes>
      <Route index element={<LoansPreview />} />
      <Route path=':id' element={<LoanContent />} />
    </Routes>
  );
};

export default Loans;
