import { cloneElement } from 'react';
import { useAppSelector } from '../../store/store';
import { Navigate } from 'react-router-dom';
import { selectCurrentUser } from '../../store/user/user.selector';

const queryString = (name: string, url = window.location.href) => {
  const parsedName = name.replace(/[[]]/g, '\\$&');
  const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, 'i');
  const results = regex.exec(url);

  if (!results || !results[2]) {
    return false;
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const UnauthenticatedRoute = (props?: any) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { children } = props;
  const redirect = queryString('redirect');

  if (currentUser) {
    return <Navigate to={redirect || '/work'} />;
  }

  return cloneElement(children, props);
};

export default UnauthenticatedRoute;
