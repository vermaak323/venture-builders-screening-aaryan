import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/external';

const useProductsStore = create((set, get) => ({
  products: [],
  categories: [],
  total: 0,
  skip: 0,
  limit: 10,
  searchQuery: '',
  selectedCategory: '',
  loading: false,
  error: null,
  clearError: () => set({ error: null }),
  
  // Cache to avoid repeat API calls
  cache: {},

  fetchCategories: async () => {
    try {
      const res = await fetch(`${API_URL}/products/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      set({ categories: data });
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  },

  fetchProducts: async (skip = 0, limit = 10, query = '', category = '') => {
    const { cache } = get();
    const cacheKey = `${skip}-${limit}-${query}-${category}`;

    if (cache[cacheKey]) {
      set({ 
        products: cache[cacheKey].products, 
        total: cache[cacheKey].total,
        skip, limit, searchQuery: query, selectedCategory: category,
        loading: false, error: null 
      });
      return;
    }

    set({ loading: true, error: null });
    try {
      let url = `${API_URL}/products`;
      if (category) {
        url += `/category/${category}?skip=${skip}&limit=${limit}`;
      } else if (query) {
        url += `/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`;
      } else {
        url += `?skip=${skip}&limit=${limit}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 429) throw new Error('Rate limit exceeded. Please wait.');
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const resData = await res.json();
      const data = { products: resData.products, total: resData.total };

      set((state) => ({
        products: data.products,
        total: data.total,
        skip, limit, searchQuery: query, selectedCategory: category,
        loading: false,
        cache: { ...state.cache, [cacheKey]: data }
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  selectedProduct: null,
  productLoading: false,

  fetchProductById: async (id) => {
    set({ productLoading: true, error: null, selectedProduct: null });
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      if (!res.ok) throw new Error('Failed to load product details');
      const data = await res.json();
      set({ selectedProduct: data, productLoading: false });
    } catch (err) {
      set({ error: err.message, productLoading: false });
    }
  }
}));

export default useProductsStore;
