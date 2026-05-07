'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, 
  CircularProgress, Alert, Chip, Divider, Rating, Paper, Stack, IconButton 
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import useProductsStore from '@/store/useProductsStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { selectedProduct, productLoading, error, fetchProductById } = useProductsStore();
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  if (productLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error || !selectedProduct) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const p = selectedProduct;
  const images = p.images && p.images.length > 0 ? p.images : [p.thumbnail];

  const handleNextImg = () => setImgIndex((prev) => (prev + 1) % images.length);
  const handlePrevImg = () => setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Dashboard</Link>
        <Typography sx={{ color: '#cbd5e1' }}>/</Typography>
        <Link href="/products" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Catalog</Link>
        <Typography sx={{ color: '#cbd5e1' }}>/</Typography>
        <Typography sx={{ color: 'primary.main', fontSize: '0.875rem', fontWeight: 600 }}>Product Details</Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Image Gallery Area */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ 
            position: 'relative', p: 2, bgcolor: '#f1f5f9', borderRadius: 4, 
            textAlign: 'center', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 400
          }}>
            <Box component="img" src={images[imgIndex]} alt={p.title} sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            {images.length > 1 && (
              <>
                <IconButton 
                  onClick={handlePrevImg} 
                  sx={{ position: 'absolute', left: 8, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  onClick={handleNextImg} 
                  sx={{ position: 'absolute', right: 8, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Paper>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1, justifyContent: 'center' }}>
            {images.map((img, i) => (
              <Box 
                key={i} 
                component="img" 
                src={img} 
                onClick={() => setImgIndex(i)}
                sx={{ 
                  width: 60, height: 60, borderRadius: 2, p: 0.5, bgcolor: 'white', 
                  cursor: 'pointer', border: imgIndex === i ? '2px solid #6366f1' : '2px solid transparent',
                  transition: '0.2s', '&:hover': { opacity: 0.8 }, objectFit: 'cover'
                }} 
              />
            ))}
          </Box>
        </Grid>

        {/* Product Info Area */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="primary.main" fontWeight="800" sx={{ letterSpacing: 2 }}>
              {p.brand} • {p.category}
            </Typography>
            <Typography variant="h3" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>{p.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={p.rating || 0} readOnly precision={0.1} />
              <Typography variant="body2" color="text.secondary">({p.rating} / 5.0)</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
              <Typography variant="h4" color="primary.main" fontWeight="800">${p.price}</Typography>
              {p.discountPercentage > 0 && (
                <Chip label={`${p.discountPercentage}% OFF`} color="error" size="small" sx={{ fontWeight: 700 }} />
              )}
            </Box>
            
            <Typography variant="body1" color="text.secondary" component="p" sx={{ lineHeight: 1.8, mb: 2 }}>
              {p.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
              <Chip 
                icon={<ShoppingCartIcon />} 
                label={p.stock > 0 ? `${p.stock} Units In Stock` : 'Out of Stock'} 
                color={p.stock > 10 ? 'success' : 'warning'} 
                variant="outlined" 
                sx={{ py: 2.5, px: 1, borderRadius: 2, fontWeight: 700 }}
              />
              <Chip 
                icon={<VerifiedUserIcon />} 
                label={p.warrantyInformation || 'Standard Warranty'} 
                variant="outlined"
                sx={{ py: 2.5, px: 1, borderRadius: 2, fontWeight: 700 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom fontWeight="700">Specifications</Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {[
              { label: 'Weight', value: `${p.weight}g` },
              { label: 'Dimensions', value: `${p.dimensions?.width}x${p.dimensions?.height}x${p.dimensions?.depth}cm` },
              { label: 'Shipping', value: p.shippingInformation },
              { label: 'Returns', value: p.returnPolicy }
            ].map((spec, i) => (
              <Grid size={{ xs: 6 }} key={i}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>{spec.label}</Typography>
                <Typography variant="body1" fontWeight="600">{spec.value}</Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
