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

frontend (React)
   ↓ HTTP requests
backend (Go API)
   ↓
SQLite database
   ↓
Stripe (payments + webhook events)

---

## Project Structure

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

## Local Setup

### Backend

Create `.env` file inside backend folder:

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

Run backend:

cd backend
go run .

Backend runs on:
http://localhost:8080

---

### Frontend

cd frontend
npm install
npm start

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

stripe listen --forward-to localhost:8080/webhook

Copy webhook secret and add to .env:

STRIPE_WEBHOOK_SECRET=whsec_xxxxx

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