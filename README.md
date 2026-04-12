# MINI SHOP PROJECT

## Overview

**Project name:** `mini-shop`

This is a full-stack mini e-commerce application that allows users to browse products, register/login, add products, and complete purchases using Stripe payments.

Each user has their own order history stored in the database, and all successful payments are recorded via Stripe webhooks.

The project demonstrates real-world full-stack development including authentication, payment integration, database management, and frontend UI development.

---

## Tech Stack

### Frontend
- React
- React Bootstrap
- React Toastify
- React Router
- Fetch API (services layer)

### Backend
- Go (net/http)
- SQLite
- JWT Authentication
- Stripe API (Payments + Webhooks)

### Database
- SQLite (auto-generated on startup)

---

## Architecture
```text
frontend (React)
   ↓ HTTP requests
backend (Go API)
   ↓
SQLite database (users, products, orders)

Stripe (external payment provider)
   ↓ webhook events
backend (updates database after payment)
```
---

## Project Structure

```text
MINI-SHOP/
├── backend/
│   ├── auth.go
│   ├── db.go
│   ├── database.db
│   ├── handlers.go
│   ├── main.go
│   ├── models.go
│   └── seed.go
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.js
│
└── README.md
---
```
## API Endpoints

### Authentication
- `POST /register` – create a new user
- `POST /login` – authenticate user and receive JWT

### Products
- `GET /products` – list all products
- `POST /products` – add a new product (authenticated)

### Orders
- `GET /orders` – list orders for current user
- `POST /checkout` – create Stripe checkout session

### Webhooks
- `POST /webhook` – Stripe webhook to record successful payments

---

## Local Setup

### Backend

Create `.env` file inside backend folder:
```text
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```
Run backend:
```text
cd backend
go run .
```
Backend runs on:
http://localhost:8080

---

### Frontend
```text
cd frontend
npm install
npm start
```
Frontend runs on:
http://localhost:3000

---

## Authentication

- User registration
- User login
- JWT authentication
- Protected API routes

---

## Stripe Local Testing (Webhook)

Run Stripe CLI:
```text
stripe listen --forward-to localhost:8080/webhook
```
Copy webhook secret and add to .env:
```text
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```
---

## Stripe Flow

1. Add products to cart  
2. Create Stripe session  
3. Redirect to Stripe checkout  
4. Stripe sends webhook  
5. Order saved in DB  

---

## Features

- User system (register/login)
- Product system (view/add products)
- Stripe payments
- Order history per user

---

## Database

SQLite auto-generated on startup:

Tables:
- users
- products

Seed data runs automatically.

---

## Summary

Full-stack mini e-commerce system built with:
- React frontend
- Go backend
- SQLite database
- Stripe payments
