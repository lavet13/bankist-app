import { cloneElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';

const queryString = (name, url = window.location.href) => {
  const parsedName = name.replace(/[[]]/g, '\\$&');
  const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, 'i');
  const results = regex.exec(url);

  if (!results || !results[2]) {
    return false;
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const UnauthenticatedRoute = props => {
  const currentUser = useSelector(selectCurrentUser);
  const { children } = props;
  const redirect = queryString('redirect');

  if (currentUser) {
    return <Navigate to={redirect || '/work'} />;
  }

  return cloneElement(children, props);
};

export default UnauthenticatedRoute;
