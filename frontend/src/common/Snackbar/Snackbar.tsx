import { Snackbar, Alert } from '@mui/material';
import { useSnackbar } from './useSnackbar';
import { snackbarStyles } from './types';

export const AppSnackbar = () => {
  const { snackbar, closeSnackbar } = useSnackbar();

  if (!snackbar) return null;

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
    <Alert
        severity={snackbar.type}
        variant="filled"
        sx={{
            borderRadius: '14px',
            fontWeight: 500,
            color: '#fff',
            background: snackbarStyles[snackbar.type],
        }}
        >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};