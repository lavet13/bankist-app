import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectCurrentUser } from '../../store/user/user.selector';

import Button, {
  BUTTON_TYPE_CLASSES,
} from '../../components/button/button.component';

import {
  createUserDocumentFromAuth,
  getRedirectResultFromAuth,
  signInWithGoogleRedirect,
  signOutUser,
} from '../../utils/firebase/firebase.utils';

import SignIn from '../../components/sign-in/sign-in.component';

import { AuthenticationContainer } from './authentication.styles';

const Authentication = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const goToHome = () => navigate('/home');

  useEffect(() => {
    (async () => {
      const response = await getRedirectResultFromAuth();

      if (response) {
        await createUserDocumentFromAuth(response.user);
        goToHome();
      }
    })();
  }, []);

  return (
    <AuthenticationContainer>
      <SignIn />
      <Button
        onClick={signInWithGoogleRedirect}
        buttonType={BUTTON_TYPE_CLASSES.google}
      >
        GOOGLE
      </Button>
      {currentUser && <Button onClick={signOutUser}>Sign Out</Button>}
      {currentUser && <img src={currentUser.photoURL} alt='' />}
    </AuthenticationContainer>
  );
};

export default Authentication;
