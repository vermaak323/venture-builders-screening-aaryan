import { create } from 'zustand';
import { resilientFetch } from '@/utils/apiClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/external';

const useUsersStore = create((set, get) => ({
  users: [],
  allUsers: [], // Global cache for all users
  total: 0,
  skip: 0,
  limit: 10,
  searchQuery: '',
  loading: false,
  hasFetchedAll: false,
  error: null,
  clearError: () => set({ error: null }),

  // New method to fetch everything once
  fetchAllUsers: async (force = false) => {
    const { hasFetchedAll, loading } = get();
    if (!force && (hasFetchedAll || loading)) return;

    set({ loading: true, error: null });
    try {
      // DummyJSON limit=0 returns all users
      const data = await resilientFetch(`${API_URL}/users?limit=0`);
      
      set({ 
        allUsers: data.users, 
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
    await get().fetchAllUsers(true);
  },

  // Helper to apply filters locally
  applyFilters: () => {
    const { allUsers, searchQuery, skip, limit } = get();
    
    let filtered = [...allUsers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.firstName.toLowerCase().includes(q) || 
        u.lastName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }

    const paginated = filtered.slice(skip, skip + limit);
    
    set({ 
      users: paginated,
      total: filtered.length
    });
  },

  fetchUsers: async (skip = 0, limit = 10, query = '') => {
    const { hasFetchedAll, fetchAllUsers } = get();
    
    // Set parameters first
    set({ skip, limit, searchQuery: query });

    if (!hasFetchedAll) {
      await fetchAllUsers();
    } else {
      get().applyFilters();
    }
  },

  selectedUser: null,
  userLoading: false,

  fetchUserById: async (id) => {
    const { allUsers } = get();
    
    // Check if we already have it in our global cache
    const cachedUser = allUsers.find(u => u.id === parseInt(id));
    if (cachedUser) {
      set({ selectedUser: cachedUser, userLoading: false, error: null });
      return;
    }

    set({ userLoading: true, error: null, selectedUser: null });
    try {
      const data = await resilientFetch(`${API_URL}/users/${id}`);
      set({ selectedUser: data, userLoading: false });
    } catch (err) {
      set({ error: err.message, userLoading: false });
    }
  }
}));

export default useUsersStore;
