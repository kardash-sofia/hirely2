import { useState, type JSX } from 'react';
import { Grid, Box, Pagination as MuiPagination } from '@mui/material';
import { Loader } from './Loader';

type GridWithPaginationProps<T> = {
  items: T[];
  itemsPerPage?: number;
  renderItem: (item: T) => JSX.Element;
  loading?: boolean;
};

export const BasicList = <T,>({ items, itemsPerPage = 6, renderItem, loading }: GridWithPaginationProps<T>) => {
  const [page, setPage] = useState(1);

  const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <Loader loading={loading ?? false} />
      
      <Grid container spacing={2} justifyContent="center">
        {paginatedItems.map((item) => (
            <Grid item xs={12} sm={6} md="auto" key={item.id} sx={{ display: 'flex' }}>
            <Box sx={{ maxWidth: 300, width: '100%' }}>
                {renderItem(item)}
            </Box>
            </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <MuiPagination
                count={Math.ceil(items.length / itemsPerPage)}
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