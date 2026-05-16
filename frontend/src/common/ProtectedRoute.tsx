import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useSnackbar } from "./Snackbar/useSnackbar";
import { SnackbarType } from "./Snackbar/types";
import { useAuth } from "../app/context/AuthContext";

type Props = {
  children: ReactElement;
  allowedRoles?: string[];
};

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [redirect, setRedirect] = useState<null | string>(null);

  useEffect(() => {
    if (!user) {
      showSnackbar("Please log in to access this page.", SnackbarType.INFO);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRedirect("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      showSnackbar("You do not have access to this page.", SnackbarType.ERROR);
      setRedirect("/");
    }
  }, [user, allowedRoles, showSnackbar]);

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return children;
};