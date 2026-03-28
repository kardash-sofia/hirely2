import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, RadioGroup, FormControlLabel, Radio, Link } from '@mui/material';

import { useSnackbar } from '../../common/Snackbar/useSnackbar';
import { SnackbarType } from '../../common/Snackbar/types';
import { useAuth } from './useAuth';
import { Role } from './types';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    fullName: '',
    role: Role.FREELANCER,
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await register(form.email, form.password, form.fullName, form.role);
      showSnackbar('Registration successful! Please log in.', SnackbarType.SUCCESS);
      navigate('/login');
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed. Please try again.';
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
          Create account
        </Typography>

        <Typography variant="body2" mb={4} color="text.secondary">
          Sign up to get started
        </Typography>

        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          margin="normal"
        />

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

       <RadioGroup
          name="role"
          row
          value={form.role}
          onChange={handleChange}
>
          <FormControlLabel
            value={Role.FREELANCER}
            control={<Radio />}
            label="Freelancer"
          />
          <FormControlLabel
            value={Role.CUSTOMER}
            control={<Radio />}
            label="Employer"
          />
        </RadioGroup>

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
          Register
        </Button>
        <Typography variant="body2" mt={2} color="text.secondary">
          Already have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/login')}
            sx={{ fontWeight: 600 }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}