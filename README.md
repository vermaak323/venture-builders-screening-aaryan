# Help Study Abroad - Frontend Technical Assessment

This project is a modern, responsive, and efficient web application built using **Next.js**, **Zustand**, and **Material-UI (MUI)**. It integrates with the public `dummyjson.com` REST API to deliver a rich Admin Dashboard experience for managing users and products.

## 🚀 Features
- **Authentication**: Secured using NextAuth and DummyJSON's Auth API. Integrates smoothly with Next.js Middleware to protect internal routes.
- **State Management**: Uses Zustand to maintain a global, predictable state for Auth, Users, and Products, coupled with localStorage persistence.
- **Pagination & Search**: API-side pagination and debounced search handlers ensure optimal performance and minimal network payloads.
- **Client-Side Caching**: Custom cache dictionaries inside Zustand prevent redundant network calls when users navigate back and forth between lists and details pages.
- **Responsive & Modern UI**: Built from the ground up with Material-UI utilizing custom themes, interactive components, and premium layout adjustments across mobile and desktop.

---

## 🏗 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-link>
   cd venture-builders-assessment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root of your directory with the following variables:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=super_secret_key_for_next_auth_12345
   NEXT_PUBLIC_API_URL=https://dummyjson.com
   ```
   *(Note: The `NEXTAUTH_SECRET` can be any random, secure string for local development.)*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser. You will be redirected to the `/login` page.

---

## 🔐 Demo Credentials
To log into the Admin panel, use the following DummyJSON user credentials:
- **Username**: `emilys`
- **Password**: `emilyspass`

---

## 🧠 Why Zustand over Redux?

Zustand was explicitly chosen for this application's state management for several pivotal reasons:
1. **Simplicity & Zero Boilerplate**: Zustand lacks the dense overhead of Redux (reducers, action types, dispatch wrappers). State properties and asynchronous API calls can exist gracefully side-by-side inside the hook definition.
2. **Built-in Async Actions**: Managing asynchronous data (like fetching paginated lists from DummyJSON) requires no middleware (like `redux-thunk` or `redux-saga`).
3. **Small Footprint**: It is incredibly lightweight, preventing bundle bloat.
4. **Hook-Based Philosophy**: It aligns perfectly with modern React hook practices, allowing for specific state-slices to be fetched within components without triggering unnecessary re-renders.

## ⚡ Client-Side Caching Strategy
A dictionary-style object-caching mechanism (`cache: {}`) is implemented directly inside the Zustand `useUsersStore` and `useProductsStore`. 
- **How it works:** When data is requested, a `cacheKey` is derived from the parameters (`skip-limit-query-category`). If this key already holds data, the app pulls from memory instantly, skipping the `axios` GET request entirely.
- **Why it's useful:** It vastly improves the user experience by providing instant load times when navigating "Back" from a Single Details View to a List View, and reduces unnecessary load on the public API.

## 🎨 UI/UX Optimization
- **`React.memo` & `useMemo`**: Used to memoize mapped Grid items and Table Rows, guaranteeing that mapping computations don't fire repeatedly during parent re-renders.
- **`useCallback`**: Applied to Pagination and Search handlers so child MUI components receive stable function references.
