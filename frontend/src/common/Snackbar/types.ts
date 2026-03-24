export enum SnackbarType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
};

export const snackbarStyles: Record<SnackbarType, string> = {
  [SnackbarType.SUCCESS]: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
  [SnackbarType.ERROR]: 'linear-gradient(135deg, #F44336, #C62828)',
  [SnackbarType.WARNING]: 'linear-gradient(135deg, #FFB300, #F57C00)',
  [SnackbarType.INFO]: 'linear-gradient(135deg, #29B6F6, #0288D1)',
};