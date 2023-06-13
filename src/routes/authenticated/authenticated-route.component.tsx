import { Navigate, useLocation } from 'react-router-dom';
import { selectCurrentUser } from '../../features/user/user.selector';
import { FC, ReactNode } from 'react';
import { useAppSelector } from '../../app/store';

type AuthenticatedRouteProps = {
  children?: ReactNode;
};

const AuthenticatedRoute: FC<AuthenticatedRouteProps> = ({ children }) => {
  const { pathname, search } = useLocation();
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    return <Navigate to={`/sign-in?redirect=${pathname}${search}`} />;
  }

  return children;
};

export default AuthenticatedRoute;
