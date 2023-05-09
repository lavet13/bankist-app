import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';

const AuthenticatedRoute = ({ children }) => {
  const { pathname, search } = useLocation();
  const currentUser = useSelector(selectCurrentUser);

  if (!currentUser) {
    return <Navigate to={`/sign-in?redirect=${pathname}${search}`} />;
  }

  return children;
};

export default AuthenticatedRoute;
