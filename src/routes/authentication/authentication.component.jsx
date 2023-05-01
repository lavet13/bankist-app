import SignIn from '../../components/sign-in/sign-in.component';

import { AuthenticationContainer } from './authentication.styles';

const Authentication = () => {
  return (
    <AuthenticationContainer>
      <SignIn />
    </AuthenticationContainer>
  );
};

export default Authentication;
