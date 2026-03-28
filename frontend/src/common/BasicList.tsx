import { useState, type JSX } from 'react';
import { Box, Grid, Pagination as MuiPagination } from '@mui/material';
import { Loader } from './Loader';

type GridWithPaginationProps<T> = {
  items: T[];
  itemsPerPage?: number;
  total: number;
  renderItem: (item: T) => JSX.Element;
  loading?: boolean;
};

export const BasicList = <T,>({ items, itemsPerPage = 10, total, renderItem, loading }: GridWithPaginationProps<T>) => {
  const [page, setPage] = useState(1);


  return (
    <>
      <Loader loading={loading ?? false} />
      
      <Grid container spacing={2} justifyContent="center">
        {items.map((item, index) => (
          <Box key={index} sx={{ flex: '1 1 300px', display: 'flex', maxWidth: 300 }}>
            {renderItem(item)}
          </Box>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <MuiPagination
                count={Math.ceil(total / itemsPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                variant="outlined"
            />
        </Box>
    </>
  );
};