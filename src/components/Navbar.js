'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import MenuIcon from '@mui/icons-material/Menu';
import useAuthStore from '@/store/useAuthStore';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    clearAuth();
    await signOut({ callbackUrl: '/login' });
  };

  if (!mounted) return null;

  // Only render on protected routes
  if (pathname === '/login') return null;

  const navLinks = [
    { title: 'Dashboard', path: '/' },
    { title: 'Users', path: '/users' },
    { title: 'Products', path: '/products' },
  ];

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: { xs: 2, lg: 0 } }}>
        <Typography 
          variant="h5" 
          component={Link} 
          href="/"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 800, 
            color: 'primary.main', 
            textDecoration: 'none',
            letterSpacing: '-0.02em'
          }}
        >
          Study<span style={{ color: '#0f172a' }}>Abroad</span>
        </Typography>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              component={Link}
              href={link.path}
              sx={{ 
                px: 2,
                color: pathname === link.path ? 'primary.main' : 'text.secondary',
                bgcolor: pathname === link.path ? 'primary.light' + '15' : 'transparent',
                '&:hover': {
                   bgcolor: 'primary.light' + '10',
                }
              }}
            >
              {link.title}
            </Button>
          ))}
          {session && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleLogout}
              sx={{ ml: 2, borderRadius: 2 }}
            >
              Logout
            </Button>
          )}
        </Box>

        <IconButton
          color="inherit"
          edge="end"
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
