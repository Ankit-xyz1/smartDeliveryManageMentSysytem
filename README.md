
# 📦 Smart Delivery Management System

A full-stack web application for smart delivery order management with auto-assignment logic for delivery partners based on real-time metrics.

**Live Demo:** [smart-delivery-management-system.vercel.app](https://smart-delivery-manage-ment-sysytem.vercel.app)  
**GitHub Repo:** [GitHub Link](https://github.com/Ankit-xyz1/smartDeliveryManageMentSysytem)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [API Documentation](#api-documentation)
- [Order Assignment Logic](#order-assignment-logic)
- [Pages](#pages)
- [How to Run Locally](#how-to-run-locally)
- [Deployment](#deployment)
- [License](#license)

---

## 🧩 Overview

This system provides:
- Dashboard for monitoring delivery partners and orders
- Smart order assignment based on partner metrics
- Partner and order CRUD operations
- Real-time delivery assignment map

---

## ✅ Features

1. **Partner Management**
   - Register, edit, and delete partners
   - Area-based availability
   - Shift scheduling and load tracking

2. **Order Management**
   - Add and track orders
   - Assign orders using metrics
   - View status and update

3. **Assignment Algorithm**
   - Assigns order to the most eligible partner
   - Factors in rating, completed orders, and cancelled orders
   - Fallback to second-best partner if cancellation rate is high

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (TypeScript), Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB (via Mongoose)
- **Database:** MongoDB Atlas
- **Deployment:** Vercel

---

## 📁 Folder Structure

```
/pages
  /api
    /partners
    /order
    /assignments
  /orders.tsx
  /partners.tsx
  /assignments.tsx
  /index.tsx
/models
/utils
/components
```

---

## 📡 API Documentation

### 🧑 Partner Routes
| Method | Route                        | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/partners/getPartner`   | Fetch all partners       |
| GET    | `/api/partners/getAPartner`  | Fetch a specific partner |
| POST   | `/api/partners/addPartner`   | Add a new partner        |
| PUT    | `/api/partners/editPartner`  | Edit partner details     |
| DELETE | `/api/partners/deletePartner`| Delete a partner         |

### 📦 Order Routes
| Method | Route                        | Description                           |
|--------|-----------------------------|---------------------------------------|
| POST   | `/api/order/assignOrder`     | Assign new order (core algorithm)     |
| GET    | `/api/order/getOrder`        | Get all orders                        |

### 🔄 Assignment Routes
| Method | Route                        | Description                             |
|--------|-----------------------------|-----------------------------------------|
| GET    | `/api/assignments`           | Get all assignment records              |
| POST   | `/api/assignments`           | Run assignment for pending orders       |

---

## 🧠 Order Assignment Logic

1. Receives order details.
2. Searches for delivery partners in the same area.
3. Filters:
   - Active status
   - Load < 3
4. Sorts by:
   - Higher rating
   - More completed orders
5. Rejects top partner if they have too many cancelled orders.
6. Assigns to best match and updates their load.

---

## 🧾 Pages

- `/` – Dashboard with key metrics, active orders map, and partner status.
- `/partners` – Partner list, add/edit forms, and stats.
- `/orders` – View and filter orders.
- `/assignments` – History of assignments and success metrics.

---

## ⚙️ How to Run Locally

```bash
git clone https://github.com/Ankit-xyz1/smartDeliveryManageMentSysytem.git
cd smartDeliveryManageMentSysytem
npm install
npm run dev
```

Set up your `.env.local` with MongoDB credentials:

```
MONGODB_URI=your_mongodb_connection_string
```

---

## 🚀 Deployment

Deployed on [Vercel](https://vercel.com), connected with GitHub for auto CI/CD.  
Live Link: [smart-delivery-management-system.vercel.app](https://smart-delivery-manage-ment-sysytem.vercel.app)

---

## 📄 License

MIT License
