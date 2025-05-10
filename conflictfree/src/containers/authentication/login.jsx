import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const message = await response.text();
        localStorage.setItem('username', username)
        navigate('/')
      } else {
        const error = await response.text();
        alert(`Login failed: ${error}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 10 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ marginTop: 2 }}
            onClick={() => navigate('/register')}
          >
            Don’t have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
