import { Box, Button, TextField, Typography, Paper, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSnackbar } from '../../common/Snackbar/useSnackbar';
import { SnackbarType } from '../../common/Snackbar/types';
import { useAuth } from './useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await login(form.email, form.password);
      showSnackbar('Login successful!', SnackbarType.SUCCESS);
      navigate('/');
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed. Please try again.';
      showSnackbar(message, SnackbarType.ERROR);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #1A0B40 0%, #6C63FF 100%)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: '20px',
          width: 400,
        }}
      >
        <Typography variant="h3" mb={2}>
          Welcome back
        </Typography>

        <Typography variant="body2" mb={4} color="text.secondary">
          Login to your account
        </Typography>

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            height: 50,
            borderRadius: '12px',
            fontWeight: 600,
          }}
          onClick={handleSubmit}
        >
          Login
        </Button>
        <Typography variant="body2" mt={2} color="text.secondary">
          Don't have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/register')}
            sx={{ fontWeight: 600 }}
          >
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}