import { Pagination as MuiPagination, Stack } from '@mui/material';

type Props = {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
};

export const Pagination: React.FC<Props> = ({ count, page, onChange }) => {
  return (
    <Stack spacing={2}>
      <MuiPagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        shape="rounded"
        variant="outlined"
      />
    </Stack>
  );
};
