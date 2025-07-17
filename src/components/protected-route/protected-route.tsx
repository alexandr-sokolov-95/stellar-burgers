import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getUser } from '../../services/reducers/user-slice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthChecked, data } = useAppSelector((state) => state.user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!data) {
    return <Navigate to='/login' />;
  }

  return children;
};
