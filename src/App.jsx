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
import Loans from './routes/loans/loans.component';
import { selectCurrentUser } from './store/user/user.selector';
import { addMovementsToUser } from './utils/firebase/firebase.utils';
import { MOVEMENTS_DATA } from './movements-data';

const App = () => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserSession());
  }, []);

  // useEffect(() => {
  //   if (currentUser) {
  //     (async () => {
  //       await addMovementsToUser(MOVEMENTS_DATA, currentUser);
  //     })();
  //   }
  // }, [currentUser]);

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
