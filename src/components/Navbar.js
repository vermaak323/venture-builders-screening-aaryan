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
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
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
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1rem' }}>G</Box>
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
                fontWeight: 600,
                color: pathname === link.path ? 'primary.main' : 'text.secondary',
                bgcolor: pathname === link.path ? '#6366f115' : 'transparent',
                '&:hover': {
                  bgcolor: '#6366f108',
                }
              }}
            >
              {link.title}
            </Button>
          ))}
          {session && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 3, gap: 2, pl: 3, borderLeft: '1px solid #e2e8f0' }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" fontWeight="700" sx={{ lineHeight: 1 }}>{session.user.name}</Typography>
                <Typography variant="caption" color="text.secondary">Administrator</Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={handleLogout}
                sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
              >
                Sign Out
              </Button>
            </Box>
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
