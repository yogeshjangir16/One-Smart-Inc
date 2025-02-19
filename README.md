# One Desktop Solution 🖥️

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A modern Windows desktop application for shopkeepers to manage inventory and billing processes efficiently.

![Dashboard Preview](https://github.com/yogeshjangir16/One-Smart-Inc/blob/2d18bcd9b3d63b5879a6e8310a7914f4d38a2f90/Images/Dashboard.png)

## Features ✨

- **Inventory Management**  
  Track products, expiry dates, and receive 30-day expiry alerts
- **Billing System**  
  Quick product search, order confirmation, and invoice generation
- **Cloud Sync**  
  Daily synchronization with Supabase cloud while working offline
- **Expiry Alerts**  
  Pop-up notifications for nearing expiry dates
- **Returns Management**  
  Handle returns for expired/unwanted products

## Tech Stack 💻

- **Frontend:** React + TypeScript, Vite, Tailwind CSS
- **Backend:** Supabase (Database & Auth)
- **Architecture:** 3-Tier Architecture (Presentation, Business Logic, Data Layers)

## Key Components 🧩

```tsx
Auth.tsx        // User authentication
Billing.tsx     // Billing interface
CloudSync.tsx   // Cloud synchronization
Inventory.tsx   // Inventory operations
Returns.tsx     // Return process management


## Installation 📦

### Clone repository:
```bash
git clone https://github.com/yogeshjangir16/One-Smart-Inc.git
cd One-Smart-Inc

### Install dependencies
```bash
npm install

### Create .env file with Supabase credentials:
```bash
VITE_SUPABASE_URL
VITE_SUPABASE_KEY

### Start application:
```bash
npm run dev

## Usage 🚀

### Login/Signup
