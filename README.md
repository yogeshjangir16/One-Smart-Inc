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

```

## Installation 📦

### 1. Clone repository:
```bash
git clone https://github.com/yogeshjangir16/One-Smart-Inc.git
cd One-Smart-Inc
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file with Supabase credentials:
```bash
VITE_SUPABASE_URL
VITE_SUPABASE_KEY
```

### 4. Start application:
```bash
npm run dev
```

## Usage 🚀

### 1. **Login/Signup**  
   ![Login Screen](https://github.com/yogeshjangir16/One-Smart-Inc/blob/f6d36a39ad5077cb801c49219a6c4ef50eb55b8a/Images/login.png)

### 2. **Dashboard Overview**  
   - Add products with expiry dates  
   - Manage inventory quantities  

### 3. **Billing Process**  
   - Search products  
   - Generate invoices  

### 4. **Cloud Sync**  
   Daily automatic sync at 12:00 AM
   
## Deployment 🌐

- **Deploy:** [https://candid-cobbler-50efla.netlify.app/](https://candid-cobbler-50ef1a.netlify.app/)  
- **Video Demo:** [Google Drive Link](https://drive.google.com/file/d/1jr8cwj_UPmqTK4uUDo4VeOA_ewaLF-35/view?usp=sharing)  

## Assumptions ⚠️

- Single-user operation only  
- Daily cloud sync with "last write wins" conflict resolution  
- Windows environment exclusive  
- Manual return process initiation

## Contact 📧

For any issues, feature requests, or support, feel free to reach out:

- **Author:** Yogesh Jangir, Vishal Patel 
- **GitHub:** [yogeshjangir16](https://github.com/yogeshjangir16)  
- **Email:** yogeshjangir2080@gmail.com 

