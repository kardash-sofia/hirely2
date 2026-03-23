import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useProfitPrediction } from '../../../hooks/usePredictions';

const ProfitPredictionForm = () => {
  const [form, setForm] = useState({
    category: '',
    ship_mode: '',
    state: '',
    cost: '',
    units: '',
    customer_id: '',
  });
  const [result, setResult] = useState<number | null>(null);
  const { mutate: predictProfit } = useProfitPrediction();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      ...form,
      cost: parseFloat(form.cost),
      units: parseInt(form.units),
    };

    predictProfit(body, {
      onSuccess: (data) => {
        setResult(data.predicted_profit);
      },
    });
  };

  return (
    <Paper
      sx={{
        p: 2,
        maxWidth: 360,
        mx: "auto",
        mt: 4,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
        Profit Prediction
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          fullWidth
          margin="dense"
          size="small"
        />

        <TextField
          label="Ship Mode"
          name="ship_mode"
          value={form.ship_mode}
          onChange={handleChange}
          fullWidth
          margin="dense"
          size="small"
        />

        <TextField
          label="State"
          name="state"
          value={form.state}
          onChange={handleChange}
          fullWidth
          margin="dense"
          size="small"
        />

        <TextField
          label="Cost"
          name="cost"
          value={form.cost}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="dense"
          size="small"
        />

        <TextField
          label="Units"
          name="units"
          value={form.units}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="dense"
          size="small"
        />

        <TextField
          label="Customer ID"
          name="customer_id"
          value={form.customer_id}
          onChange={handleChange}
          fullWidth
          margin="dense"
          size="small"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="small"
          sx={{
            mt: 2,
            textTransform: "none",
            fontSize: "0.85rem",
            py: 0.8,
            borderRadius: 2,
          }}
        >
          Predict
        </Button>
      </Box>

      {result !== null && (
        <Typography
          mt={2}
          fontSize="0.85rem"
          color="success.main"
          sx={{
            background: "rgba(76, 175, 80, 0.08)",
            p: 1,
            borderRadius: 2,
          }}
        >
          Predicted Profit: <b>{result.toFixed(2)}</b>
        </Typography>
      )}
    </Paper>
  );
};

export default ProfitPredictionForm;
