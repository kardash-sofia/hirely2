import { useState } from 'react';
import { Box, Tabs, Tab, Container } from '@mui/material';
import { ProductsTab } from './tabs/ProductsTab';
import SalesPredictionsTab from './tabs/SalesPredictionsTab';

export const TabsSection = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTab(newValue);

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Products" />
          <Tab label="Sales predictions" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tab === 0 && <ProductsTab/>}
          {tab === 1 && <SalesPredictionsTab/>}
        </Box>
      </Container>
    </Box>
  );
};