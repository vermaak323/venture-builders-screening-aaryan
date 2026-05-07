import { create } from 'zustand';
import { resilientFetch } from '@/utils/apiClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/external';

const useProductsStore = create((set, get) => ({
  products: [],
  allProducts: [], // Global cache for all products
  categories: [],
  total: 0,
  skip: 0,
  limit: 10,
  searchQuery: '',
  selectedCategory: '',
  loading: false,
  hasFetchedAll: false,
  error: null,
  clearError: () => set({ error: null }),

  fetchCategories: async () => {
    try {
      const data = await resilientFetch(`${API_URL}/products/categories`);
      set({ categories: data });
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  },

  // New method to fetch everything once
  fetchAllProducts: async (force = false) => {
    const { hasFetchedAll, loading } = get();
    if (!force && (hasFetchedAll || loading)) return;

    set({ loading: true, error: null });
    try {
      // DummyJSON limit=0 returns all products
      const data = await resilientFetch(`${API_URL}/products?limit=0`);
      
      set({ 
        allProducts: data.products, 
        total: data.total,
        hasFetchedAll: true,
        loading: false 
      });
      
      // Initialize view with first page
      get().applyFilters();
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  refreshData: async () => {
    set({ hasFetchedAll: false });
    await get().fetchAllProducts(true);
  },

  // Helper to apply filters locally
  applyFilters: () => {
    const { allProducts, searchQuery, selectedCategory, skip, limit } = get();
    
    let filtered = [...allProducts];

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
      );
    }

    const paginated = filtered.slice(skip, skip + limit);
    
    set({ 
      products: paginated,
      total: filtered.length
    });
  },

  fetchProducts: async (skip = 0, limit = 10, query = '', category = '') => {
    const { hasFetchedAll, fetchAllProducts } = get();
    
    // Set parameters first
    set({ skip, limit, searchQuery: query, selectedCategory: category });

    if (!hasFetchedAll) {
      // If we haven't fetched all yet, we fetch everything first
      // This fulfills the "once everything is fetched" requirement
      await fetchAllProducts();
    } else {
      // Already have everything, just filter locally
      get().applyFilters();
    }
  },

  selectedProduct: null,
  productLoading: false,

  fetchProductById: async (id) => {
    const { allProducts } = get();
    
    // Check if we already have it in our global cache
    const cachedProduct = allProducts.find(p => p.id === parseInt(id));
    if (cachedProduct) {
      set({ selectedProduct: cachedProduct, productLoading: false, error: null });
      return;
    }

    set({ productLoading: true, error: null, selectedProduct: null });
    try {
      const data = await resilientFetch(`${API_URL}/products/${id}`);
      set({ selectedProduct: data, productLoading: false });
    } catch (err) {
      set({ error: err.message, productLoading: false });
    }
  }
}));

export default useProductsStore;
