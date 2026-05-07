'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Card, Typography, TextField, Button, Alert, CircularProgress, Stack, Container } from '@mui/material';
import useAuthStore from '@/store/useAuthStore';

export default function LoginPage() {
  const [username, setUsername] = useState('emilys'); // Default dummyjson user
  const [password, setPassword] = useState('emilyspass');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (result.error) {
        setError('Invalid username or password');
      } else {
        // Fetch session to retrieve user profile and token, then sync with Zustand
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        if (session?.user) {
          setAuth(session.user, session.user.token);
        }
        
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, #eef2ff 0%, #f8fafc 100%)',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, position: 'relative', overflow: 'visible' }}>
          {/* Decorative element */}
          <Box sx={{ 
            position: 'absolute', top: -20, left: -20, width: 60, height: 60, 
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', 
            borderRadius: 3, zIndex: -1, opacity: 0.3 
          }} />
          
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="primary.main">
              Admin Portal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Please enter your details.
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                variant="outlined"
                placeholder="emilys"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                placeholder="emilyspass"
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Study Abroad Assessment Dashboard &copy; 2026
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
