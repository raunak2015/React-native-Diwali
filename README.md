# RentEase — Full-Stack Real Estate Rental Platform

A modern full-stack rental platform built with **React Native (Expo)**, **Node.js**, **Express**, and **MongoDB**. RentEase connects home seekers with verified rental listings, enabling discovery, filtering, in-app tour scheduling, and bookmarking.

---

## 📱 Features

- **Authentication**: JWT-based user authentication (Register, Login, Me) with bcrypt password hashing and persistent sessions via AsyncStorage.
- **Property Discovery**: Rich home feed showcasing featured listings, category filtering (Apartments, Houses, Villas, Studios), and keyword search.
- **Detailed Property Views**: Multi-image preview, full specs (Bedrooms, Bathrooms, Sq Ft, Furnishing status), security deposit breakdown, and amenities list.
- **Search & Filters**: Real-time filtering by city, property type, price ranges, and keywords.
- **Bookmarks / Favorites**: Cloud-synced saved listings accessible across devices.
- **Visit Scheduling**: In-person tour booking with configurable morning, afternoon, and evening slots.
- **User Profile & Settings**: Account overview, role management (Renter vs. Landlord), notifications toggle, and secure sign-out.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native 0.86 with Expo SDK 57 (Expo Router)
- **Styling**: Themed Components, StyleSheet, CSS Modules
- **State & Storage**: React Context API, Universal Storage Layer
- **Icons & Assets**: Custom SVG & PNG iconography, Expo Symbols

### Backend
- **Runtime**: Node.js & Express 5
- **Database**: MongoDB with Mongoose ODM
- **Security**: JSON Web Tokens (JWT), bcryptjs password hashing, CORS
- **Uploads**: Multer image processing pipeline

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Expo Go app on mobile (or iOS/Android simulator)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
The server will run at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run start
```
Scan the QR code with Expo Go or press `w` to open in browser.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Sign in & receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch active user profile | Bearer Token |
| `GET` | `/api/properties` | List properties with query filters | Public |
| `GET` | `/api/properties/featured` | Fetch featured listings | Public |
| `GET` | `/api/properties/:id` | Get single property details | Public |
| `POST` | `/api/properties` | Create new listing | Landlord/Admin |
| `GET` | `/api/favorites` | Fetch user bookmarked properties | Bearer Token |
| `POST` | `/api/favorites/:id` | Toggle property favorite | Bearer Token |
| `GET` | `/api/visits` | Fetch user scheduled visits | Bearer Token |
| `POST` | `/api/visits` | Book a property visit | Bearer Token |

---

## 📄 License
ISC License © 2026 Raunak Shahu
