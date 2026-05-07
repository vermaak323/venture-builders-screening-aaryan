'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Alert, Button, Card, Grid,
  InputAdornment, Skeleton, Avatar, Chip, Pagination, OutlinedInput, FormControl
} from '@mui/material';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import useUsersStore from '@/store/useUsersStore';

export default function UsersPage() {
  const { users, total, skip, limit, searchQuery, loading, error, fetchUsers, clearError, refreshData } = useUsersStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search query to prevent excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        fetchUsers(0, limit, localSearch);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, limit, searchQuery, fetchUsers]);

  // Initial data fetch if the store is empty
  useEffect(() => {
    if (users.length === 0 && !loading && !error) {
      fetchUsers(skip, limit, searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" gutterBottom>Users Directory</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor all active users within the platform.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={refreshData}
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <OutlinedInput
                placeholder="Search by name, email, or company..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="body2" color="text.secondary">
              Total Records: <strong>{total}</strong>
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {error && (
        <Alert 
          severity={error.includes('Rate limit') ? 'warning' : 'error'} 
          onClose={clearError} 
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ border: 'none', boxShadow: 'none', bgcolor: 'transparent', opacity: loading ? 0.7 : 1 }}>
        <Table sx={{ minWidth: 650, bgcolor: 'background.paper', borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contact Info</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Professional</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && users.length === 0 ? (
              [...Array(limit)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} align="center"><Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1, my: 1 }} /></TableCell>
                </TableRow>
              ))
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.image} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="600">{user.firstName} {user.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">ID: #{user.id}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.email}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.gender}
                      size="small"
                      color={user.gender === 'female' ? 'secondary' : 'primary'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.company?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.company?.title}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      component={Link}
                      href={`/users/${user.id}`}
                      variant="text"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(total / limit)}
          page={Math.floor(skip / limit) + 1}
          onChange={(_, page) => fetchUsers((page - 1) * limit, limit, searchQuery)}
          color="primary"
          shape="rounded"
          disabled={loading}
        />
      </Box>
    </Box>
  );
}
