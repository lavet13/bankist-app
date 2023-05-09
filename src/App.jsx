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

import { checkUserSession } from './store/user/user.action';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserSession());
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
      </Route>
    </Routes>
  );
};

export default App;
