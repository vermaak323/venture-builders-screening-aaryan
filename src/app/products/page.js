'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  Box, Typography, Grid, Card, CardContent,
  CardMedia, Button, MenuItem, Select, FormControl, InputLabel,
  Alert, Chip, Pagination, InputAdornment, Skeleton, OutlinedInput
} from '@mui/material';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import useProductsStore from '@/store/useProductsStore';

// 3b. Optimization: Memoize the Product Card to prevent unnecessary re-renders
// during search/filter operations in the parent component.
const ProductCard = memo(({ product, loading }) => (
  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
    <Card sx={{ 
      height: '100%', display: 'flex', flexDirection: 'column', 
      position: 'relative', opacity: loading ? 0.6 : 1,
      transition: 'opacity 0.2s'
    }}>
      <Chip
        label={`$${product.price}`}
        color="primary"
        size="small"
        sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700, zIndex: 1 }}
      />
      <CardMedia
        component="img"
        height="160"
        image={product.thumbnail}
        alt={product.title}
        sx={{ p: 2, objectFit: 'contain', bgcolor: '#f1f5f9' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="caption" color="secondary.main" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          {product.category}
        </Typography>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1, height: '2.8rem', overflow: 'hidden', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
          {product.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="body2" color={product.stock < 10 ? 'error.main' : 'success.main'} fontWeight="600">
            {product.stock < 10 ? `Low Stock: ${product.stock}` : `In Stock: ${product.stock}`}
          </Typography>
        </Box>
        <Button
          fullWidth
          component={Link}
          href={`/products/${product.id}`}
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  </Grid>
));

ProductCard.displayName = 'ProductCard';

export default function ProductsPage() {
  const {
    products, categories, total, skip, limit, searchQuery, selectedCategory,
    loading, error, fetchProducts, fetchCategories, clearError, refreshData
  } = useProductsStore();
  
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // 3b. Optimization: Use useCallback to stabilize function references
  const handleFetch = useCallback((...args) => fetchProducts(...args), [fetchProducts]);
  const handleRefresh = useCallback(() => refreshData(), [refreshData]);

  useEffect(() => {
    fetchCategories();
    if (products.length === 0 && !loading && !error) {
      handleFetch(skip, limit, searchQuery, selectedCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        handleFetch(0, limit, localSearch, selectedCategory);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, limit, searchQuery, selectedCategory, handleFetch]);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Product Catalog</Typography>
          <Typography variant="body2" color="text.secondary">
            Explore our range with real-time local search and filtering.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <FormControl fullWidth size="small">
              <OutlinedInput
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                disabled={!!selectedCategory}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                }
              />
              {selectedCategory && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>
                  Search disabled when filtering by category
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-label">Category Filter</InputLabel>
              <Select
                labelId="category-label"
                value={selectedCategory}
                label="Category Filter"
                onChange={(e) => handleFetch(0, limit, '', e.target.value)}
                startAdornment={
                  <InputAdornment position="start" sx={{ mr: 1 }}>
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => {
                  const slug = typeof cat === 'string' ? cat : cat.slug;
                  const name = typeof cat === 'string' ? cat : cat.name;
                  return <MenuItem key={slug} value={slug}>{name}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="body2" color="text.secondary">
              Showing <strong>{products.length}</strong> of <strong>{total}</strong>
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {error && (
        <Alert 
          severity={error.includes('Rate limit') ? 'warning' : 'error'} 
          onClose={clearError} 
          sx={{ mb: 4 }}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {loading && products.length === 0 ? (
          [...Array(8)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} loading={loading} />
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">No products found.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 6, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(total / limit)}
          page={Math.floor(skip / limit) + 1}
          onChange={(_, page) => handleFetch((page - 1) * limit, limit, searchQuery, selectedCategory)}
          color="primary"
          shape="rounded"
          disabled={loading}
        />
      </Box>
    </Box>
  );
}
