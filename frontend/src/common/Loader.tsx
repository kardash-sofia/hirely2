import { CircularProgress, Box } from '@mui/material';

type LoaderProps = {
  loading: boolean;
};

export const Loader: React.FC<LoaderProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress />
    </Box>
  );
};