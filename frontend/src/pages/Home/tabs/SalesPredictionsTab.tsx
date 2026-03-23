import ProfitPredictionForm from './ProfitPredictionForm';
import { Grid, Typography } from '@mui/material';
import ShipModePredictionForm from './ShipModePredictionForm';

const SalesPredictionsTab = () => {
	return (
		<>
			<Typography variant="h5" mb={3}>Sales Predictions</Typography>
            <Grid container spacing={4}>
			    <Grid item xs={12} md={6}>
				    <ProfitPredictionForm />
			    </Grid>
			    <Grid item xs={12} md={6}>
				    <ShipModePredictionForm />
			    </Grid>
			</Grid>
		</>
	);
};

export default SalesPredictionsTab;
