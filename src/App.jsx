import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import Authentication from './routes/authentication/authentication.component';
import Navigation from './routes/navigation/navigation.component';
import Home from './routes/home/home.component';

import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener,
} from './utils/firebase/firebase.utils';

import { setCurrentUser } from './store/user/user.action';
import { selectCurrentUser } from './store/user/user.selector';

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(user => {
      if (user) {
        createUserDocumentFromAuth(user);
      }

      dispatch(setCurrentUser(user));
    });

    return unsubscribe;
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Navigation />}>
        <Route index element={<Authentication />} />
        {currentUser && <Route path='home' element={<Home />} />}
      </Route>
    </Routes>
  );
};

export default App;
