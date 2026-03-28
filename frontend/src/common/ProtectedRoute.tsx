import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../pages/Auth/useAuth';
import { useSnackbar } from './Snackbar/useSnackbar';
import { SnackbarType } from './Snackbar/types';

type Props = {
  children: ReactElement;
};

export const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  if (!user) {
    showSnackbar('Please log in to access this page.', SnackbarType.INFO);
    return <Navigate to="/login" replace />;
  }

  return children;
};