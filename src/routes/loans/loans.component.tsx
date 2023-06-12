import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { fetchLoanStart, fetchLoansStart } from '../../store/loan/loan.action';

import { selectCurrentUser } from '../../store/user/user.selector';

import LoansPreview from '../loans-preview/loans-preview.component';
import LoanContent from '../loan/loan-content.component';
import { useAppSelector } from '../../store/store';

const Loans = () => {
  const dispatch = useDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser && !currentUser.admin)
      dispatch(fetchLoanStart(currentUser));
    else if (currentUser && currentUser.admin) dispatch(fetchLoansStart());
  }, [currentUser]);

  return (
    <Routes>
      <Route index element={<LoansPreview />} />
      <Route path=':id' element={<LoanContent />} />
    </Routes>
  );
};

export default Loans;
