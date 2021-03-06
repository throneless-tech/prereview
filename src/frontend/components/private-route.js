import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import UserProvider from '../contexts/user-context';
import NotFound from './not-found';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export default function PrivateRoute({ children, ...rest }) {
  const [user] = useContext(UserProvider.context);

  return <Route {...rest}>{user ? children : <Redirect to="/login" />}</Route>;
}

PrivateRoute.propTypes = {
  children: PropTypes.any.isRequired,
};

export function AdminRoute({ children, ...rest }) {
  const [user] = useContext(UserProvider.context);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

  if (!user) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Route {...rest}>
        {user && isAdmin ? (
          children
        ) : user && !isAdmin ? (
          <NotFound />
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
    );
  }
}

AdminRoute.propTypes = {
  children: PropTypes.any.isRequired,
};
