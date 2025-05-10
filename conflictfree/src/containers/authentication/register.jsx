import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { post } from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const result = await post('/register', {
        username: formData.username,
        password: formData.password,
      });
      navigate('/login')
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 10 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ marginTop: 2 }}
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
