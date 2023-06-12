import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Work from './routes/work/work.component';
import SignIn from './routes/sign-in/sign-in.component';
import SignUp from './routes/sign-up/sign-up.component';
import UnauthenticatedRoute from './routes/unauthenticated/unauthenticated-route-.component';
import AuthenticatedRoute from './routes/authenticated/authenticated-route.component';
import Settings from './routes/settings/settings.component';

import Loans from './routes/loans/loans.component';
import { userSessionChecked } from './store/user/user.reducer';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userSessionChecked());
  }, []);

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
          path='loans/*'
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
