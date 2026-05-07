# Help Study Abroad - Admin Dashboard

A premium, professional-grade administrative dashboard built with **Next.js**, **Material UI (MUI)**, and **Zustand** as part of a technical assessment.

## 🚀 Key Features

- **Authentication**: Secure login flow using `next-auth` and DummyJSON credentials.
- **Protected Routes**: Dashboard access is restricted to authenticated users via Next.js Middleware.
- **User Management**: 
  - Searchable user directory with pagination.
  - Detailed profile view with professional metadata layout.
- **Product Catalog**: 
  - E-commerce style grid with category filtering and real-time search.
  - Sophisticated product detail view with image carousel and technical specs.
- **State Management**: Robust implementation using Zustand with async actions and a caching layer.
- **Premium UI/UX**: Overhauled with an Indigo/Slate theme, glassmorphism headers, and responsive layouts.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [Material UI (MUI) v6](https://mui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **API**: [DummyJSON](https://dummyjson.com/)

## 🏗️ Project Architecture

### Why Zustand?
We chose **Zustand** over Redux for this project because:
1. **Simplicity**: It provides a much cleaner API with zero boilerplate (no reducers or action types).
2. **Performance**: It uses a subscription model that minimizes unnecessary re-renders.
3. **Async Actions**: Handling API calls directly within the store is intuitive and keeps components clean.
4. **Footprint**: It's significantly smaller than Redux, making it perfect for modern Next.js apps.

### Caching Strategy
To optimize performance and user experience, we implemented a **dictionary-based caching layer** within the Zustand stores. 
- **Mechanism**: The store maintains a `cache` object where keys are derived from the current API parameters (skip, limit, query).
- **Benefit**: Navigating between pages or repeating a search result is instantaneous, as the app retrieves data from memory instead of triggering a network request.

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Clone and Install
```bash
git clone https://github.com/vermaak323/venture-builders-screening-aaryan.git
cd venture-builders-assessment
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here
NEXT_PUBLIC_API_URL=/api/external
AUTH_API_URL=https://dummyjson.com
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Demo Credentials
Use any valid DummyJSON user to log in (e.g., `emilys` / `emilyspass`).

---
Built by **Antigravity** for the Help Study Abroad Assessment.
