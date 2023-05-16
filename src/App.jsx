import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Work from './routes/work/work.component';
import SignIn from './routes/sign-in/sign-in.component';
import SignUp from './routes/sign-up/sign-up.component';
import UnauthenticatedRoute from './routes/unauthenticated/unauthenticated-route-.component';
import AuthenticatedRoute from './routes/authenticated/authenticated-route.component';
import Settings from './routes/settings/settings.component';

import { checkUserSession } from './store/user/user.action';
import { fetchLoanStart } from './store/loan/loan.action';
import { selectCurrentUser } from './store/user/user.selector';
import Loans from './routes/loans/loans.component';

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(checkUserSession());
    const initializeAdmin = async () => {
      const data = await fetch('/.netlify/functions/initialize-admin-sdk');
      console.log(data);
    };
    initializeAdmin();
  }, []);

  useEffect(() => {
    dispatch(fetchLoanStart(currentUser));
  }, [currentUser]);

  return (
    <Routes>
      <Route path='/' element={<Navigation />}>
        <Route index element={<Home />} />
        <Route
          path='sign-in'
          element={
            <UnauthenticatedRoute>
              <SignIn />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path='sign-up'
          element={
            <UnauthenticatedRoute>
              <SignUp />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path='work'
          element={
            <AuthenticatedRoute>
              <Work />
            </AuthenticatedRoute>
          }
        />
        <Route
          path='loans'
          element={
            <AuthenticatedRoute>
              <Loans />
            </AuthenticatedRoute>
          }
        />
        <Route
          path='settings'
          element={
            <AuthenticatedRoute>
              <Settings />
            </AuthenticatedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
