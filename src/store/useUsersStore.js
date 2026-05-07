import { create } from 'zustand';

/**
 * ZUSTAND STATE MANAGEMENT RATIONALE:
 * We chose Zustand for this assessment because:
 * 1. Simplicity: Much less boilerplate compared to Redux (no reducers, types, or complex setup).
 * 2. Small Footprint: It's extremely lightweight (~1KB), keeping the bundle size small.
 * 3. Built-in Async: Actions are just functions, making API integration straightforward.
 * 4. Performant: It handles transient state updates efficiently without excessive re-renders.
 */

// Use relative path for client-side proxying via next.config.js rewrites
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/external';

const useUsersStore = create((set, get) => ({
  users: [],
  total: 0,
  skip: 0,
  limit: 10,
  searchQuery: '',
  loading: false,
  error: null,
  clearError: () => set({ error: null }),
  
  /**
   * CACHING STRATEGY:
   * We implement a dictionary-based caching layer (`cache` object).
   * - Key: A unique string based on skip, limit, and query parameters.
   * - Value: The response data (users array and total count).
   * 
   * Benefit: Avoids repeat API calls when the user navigates between pages or search queries 
   * they've already visited, resulting in an "instant" UI feel and reduced server load.
   */
  cache: {},

  fetchUsers: async (skip = 0, limit = 10, query = '') => {
    const { cache } = get();
    const cacheKey = `${skip}-${limit}-${query}`;

    if (cache[cacheKey]) {
      set({ 
        users: cache[cacheKey].users, 
        total: cache[cacheKey].total,
        skip, limit, searchQuery: query, 
        loading: false, error: null 
      });
      return;
    }

    set({ loading: true, error: null });
    try {
      let url = `${API_URL}/users`;
      if (query) {
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
      const data = { users: resData.users, total: resData.total };

      set((state) => ({
        users: data.users,
        total: data.total,
        skip, limit, searchQuery: query,
        loading: false,
        cache: { ...state.cache, [cacheKey]: data }
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  selectedUser: null,
  userLoading: false,

  fetchUserById: async (id) => {
    set({ userLoading: true, error: null, selectedUser: null });
    try {
      const res = await fetch(`${API_URL}/users/${id}`);
      if (!res.ok) throw new Error('Failed to load user profile');
      const data = await res.json();
      set({ selectedUser: data, userLoading: false });
    } catch (err) {
      set({ error: err.message, userLoading: false });
    }
  }
}));

export default useUsersStore;
