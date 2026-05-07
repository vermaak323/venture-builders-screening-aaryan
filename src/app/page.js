'use client';

import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import Link from 'next/link';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function Dashboard() {
  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Admin
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your platform's activity and manage users and products.
        </Typography>
      </Box>

      {/* Quick Stats Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: 'Total Users', value: '1,248', icon: <PeopleIcon />, color: '#6366f1' },
          { label: 'Active Products', value: '452', icon: <InventoryIcon />, color: '#06b6d4' },
          { label: 'Total Revenue', value: '$12,450', icon: <InventoryIcon />, color: '#10b981' },
        ].map((stat, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h5">
                  {stat.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Management Modules
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card 
            component={Link} 
            href="/users" 
            sx={{ 
              p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', 
              textDecoration: 'none', color: 'inherit',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#6366f115', color: 'primary.main', mb: 2 }}>
              <PeopleIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" fontWeight="700" gutterBottom>Users Management</Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              View, search and manage all registered users in the system.
            </Typography>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card 
            component={Link} 
            href="/products" 
            sx={{ 
              p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', 
              textDecoration: 'none', color: 'inherit',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#06b6d415', color: 'secondary.main', mb: 2 }}>
              <InventoryIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" fontWeight="700" gutterBottom>Products Catalog</Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Browse categories, check stock levels, and manage inventory.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
