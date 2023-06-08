import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLoanStart, fetchLoansStart } from '../../store/loan/loan.action';

import { selectCurrentUser } from '../../store/user/user.selector';

import LoansPreview from '../loans-preview/loans-preview.component';
import Loan from '../loan/loan.component';

const Loans = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser && !currentUser.admin)
      dispatch(fetchLoanStart(currentUser));
    else if (currentUser && currentUser.admin) dispatch(fetchLoansStart());
  }, [currentUser]);

  return (
    <Routes>
      <Route index element={<LoansPreview />} />
      <Route path=':id' element={<Loan />} />
    </Routes>
  );
};

export default Loans;
