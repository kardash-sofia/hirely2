import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useShipPrediction } from "../../../hooks/usePredictions";

const ShipModePredictionForm = () => {
  const [form, setForm] = useState({
    price: "",
    units: "",
    profit: "",
    category: "",
    city: "",
  });

  const [result, setResult] = useState<string | null>(null);

  const { mutateAsync: predictShipMode, isPending, error } =
    useShipPrediction();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      ...form,
      price: parseFloat(form.price),
      units: parseInt(form.units),
      profit: parseFloat(form.profit),
    };

    try {
      const res = await predictShipMode(body);
      setResult(res.predicted_ship);
    } catch (err) {
      console.error(err);
    }
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
        Ship Mode Prediction
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Price"
          name="price"
          value={form.price}
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
          label="Profit"
          name="profit"
          value={form.profit}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="dense"
          size="small"
        />

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
          label="City"
          name="city"
          value={form.city}
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
          disabled={isPending}
          sx={{
            mt: 2,
            textTransform: "none",
            fontSize: "0.85rem",
            py: 0.8,
            borderRadius: 2,
          }}
        >
          {isPending ? "Predicting..." : "Predict"}
        </Button>
      </Box>

      {result && (
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
          Predicted Ship Mode: <b>{result}</b>
        </Typography>
      )}

      {error && (
        <Typography mt={1} fontSize="0.8rem" color="error">
          Something went wrong 😢
        </Typography>
      )}
    </Paper>
  );
};

export default ShipModePredictionForm;