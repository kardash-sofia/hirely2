import { useEffect, useState } from 'react';
import { snackbarStore } from './snackbarStore';
import type { SnackbarType } from './types';

type SnackbarState = {
  message: string;
  type: SnackbarType;
  open: boolean;
} | null;

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>(null);

  useEffect(() => {
    return snackbarStore.subscribe(setSnackbar);
  }, []);

  return {
    snackbar,
    showSnackbar: snackbarStore.show,
    closeSnackbar: snackbarStore.close,
  };
};