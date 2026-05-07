'use client';

import React, { useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Avatar, 
  Divider, Button, CircularProgress, Alert, Stack, Chip
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import useUsersStore from '@/store/useUsersStore';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { selectedUser, userLoading, error, fetchUserById } = useUsersStore();

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id, fetchUserById]);

  if (userLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error || !selectedUser) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error || 'User not found'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const user = selectedUser;

  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => router.back()} 
        sx={{ mb: 4, fontWeight: 700 }}
      >
        Back to Directory
      </Button>

      <Grid container spacing={4}>
        {/* Profile Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <Box sx={{ position: 'relative', mb: 3 }}>
               <Box sx={{ height: 100, borderRadius: 2, bgcolor: 'primary.main', opacity: 0.1, mb: -6 }} />
               <Avatar 
                src={user.image} 
                sx={{ width: 120, height: 120, mx: 'auto', border: '4px solid white', boxShadow: 3 }} 
              />
            </Box>
            <Typography variant="h5" fontWeight="800">{user.firstName} {user.lastName}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>{user.company?.title}</Typography>
            <Chip label={user.role || 'Member'} color="primary" size="small" sx={{ mt: 1, fontWeight: 600 }} />
            
            <Divider sx={{ my: 3 }} />
            
            <Stack spacing={2} sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2">{user.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2">{user.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2">{user.address?.city}, {user.address?.state}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Details Area */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={4}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="700">Employment Details</Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Company</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <BusinessIcon fontSize="small" color="primary" />
                      <Typography variant="body1" fontWeight="600">{user.company?.name}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Department</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>{user.company?.department}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="700">Personal Information</Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Age</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>{user.age} Years</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Gender</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5, textTransform: 'capitalize' }}>{user.gender}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Blood Group</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>{user.bloodGroup}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Height/Weight</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>{user.height}cm / {user.weight}kg</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="700">Education</Typography>
                <Typography variant="body1">{user.university}</Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
