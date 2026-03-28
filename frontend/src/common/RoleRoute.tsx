import type { ReactElement } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useSnackbar } from "./Snackbar/useSnackbar";
import { SnackbarType } from "./Snackbar/types";

type Props = {
  children: ReactElement;
  roles: string[];
};

export const RoleRoute = ({ children, roles }: Props) => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();


  if (!user) return <Navigate to="/login" />;

  if (!roles.includes(user.role)) {
    showSnackbar("You do not have permission to access this page.", SnackbarType.INFO);
    return <Navigate to="/" />;
  }

  return children;
};