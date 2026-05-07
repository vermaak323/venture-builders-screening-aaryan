# Venture Builders - Admin Dashboard

A premium, high-performance Admin Dashboard built with **Next.js 15**, **Material UI**, and **Zustand**. This application delivers a seamless experience for managing users and products, featuring a resilient data-fetching architecture.

---

## ✨ Core Highlights

*   **Resilient API Architecture**: Integrated a custom `resilientFetch` client that handles `429 Too Many Requests` errors using **Exponential Backoff** and automatic retries.
*   **Smart In-Memory Caching**: Implements a "Load Once" strategy for catalogs. Once data is fetched, searching, filtering, and pagination happen instantaneously on the client side, eliminating redundant network calls.
*   **Premium Aesthetic UI**: Built with a custom Material UI theme featuring glassmorphism elements, sleek transitions, and a fully responsive layout.
*   **State Management**: Powered by **Zustand** for a lightweight, boilerplate-free global state that manages authentication and data catalogs.

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
git clone <your-repo-url>
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
