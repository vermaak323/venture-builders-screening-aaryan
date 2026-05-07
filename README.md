# Venture Builders Assessment Task

A premium, high-performance Admin Dashboard built with **Next.js 15**, **Material UI**, and **Zustand**. This application delivers a seamless experience for managing users and products, featuring a resilient data-fetching architecture.

---

## ✨ Core Highlights

*   **Resilient API Architecture**: Integrated a custom `resilientFetch` client that handles `429 Too Many Requests` errors using **Exponential Backoff** and automatic retries.
*   **Smart In-Memory Caching**: Implements a "Load Once" strategy for catalogs. Once data is fetched, searching, filtering, and pagination happen instantaneously on the client side, eliminating redundant network calls.
*   **Premium Aesthetic UI**: Built with a custom Material UI theme featuring glassmorphism elements, sleek transitions, and a fully responsive layout.
*   **State Management**: Powered by **Zustand** for a lightweight, boilerplate-free global state that manages authentication and data catalogs.

---

## 🧠 Why Zustand over Redux?

For this assessment, **Zustand** was chosen for several key reasons:
1.  **Zero Boilerplate**: Unlike Redux, which requires reducers, action types, and complex dispatch logic, Zustand allows us to define state and async actions in a single, clean hook.
2.  **Built-in Async Support**: Handling API calls (like our resilient fetch) is trivial with Zustand's native support for async functions.
3.  **Small Footprint**: It is significantly smaller than Redux + Redux Toolkit, which is ideal for small-to-medium-sized technical assessments.
4.  **Performance**: Zustand's selector-based approach ensures components only re-render when the specific data they need changes.

---

## ⚡ Caching & Performance Optimization

### Client-Side Caching (Requirement 3c)
I implemented a **"Load Once, Search Locally"** strategy:
*   **The Problem**: Real-time searching on a public API often triggers `429 Too Many Requests` (Rate Limiting).
*   **The Solution**: Upon the first visit to the Products or Users page, the app fetches the entire catalog (100 items). 
*   **The Result**: All subsequent searching, filtering (by category), and pagination are performed **locally in memory**. This results in sub-millisecond response times and zero additional network load.

### Component Optimization (Requirement 3b)
*   **Memoization**: Used `React.memo` on List items (`ProductCard`, `UserTableRow`) to prevent expensive re-renders while the user is typing in the search bar.
*   **Stable References**: Utilized `useCallback` for event handlers and fetch triggers to maintain stable function references across renders.
*   **Debouncing**: Implemented a 500ms debounce on search inputs to prevent the UI from stuttering during rapid typing.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Material UI (MUI) & Vanilla CSS
- **State**: Zustand
- **Icons**: MUI Icons
- **API**: DummyJSON (Mock REST API)

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/vermaak323/venture-builders-screening-aaryan.git
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any_random_string
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

### 3. Run Development
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## 🔐 Demo Credentials

Use these DummyJSON credentials to access the dashboard:
- **Username**: `emilys`
- **Password**: `emilyspass`

---

## 📂 Project Structure

- `/src/app`: Next.js pages and layouts.
- `/src/store`: Zustand stores for global state management.
- `/src/utils`: Resilient API client and helper functions.
- `/src/theme`: Custom MUI theme configuration.
