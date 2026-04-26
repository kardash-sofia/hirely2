import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../pages/Auth/useAuth";
import { useSnackbar } from "./Snackbar/useSnackbar";
import { SnackbarType } from "./Snackbar/types";

type Props = {
  children: ReactElement;
  allowedRoles?: string[];
};

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  if (!user) {
    showSnackbar("Please log in to access this page.", SnackbarType.INFO);
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    showSnackbar("You do not have access to this page.", SnackbarType.ERROR);
    return <Navigate to="/" replace />;
  }

  return children;
};