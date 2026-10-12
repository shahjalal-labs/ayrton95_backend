# Ayrton95 Backend (Mekacar Automotive Marketplace & Service Booking API)

<p align="center">
  <img src="assets/banner.svg" alt="Ayrton95 Backend Banner" width="100%">
</p>

<p align="center">
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js" alt="Node.js"></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-4.18-black?style=for-the-badge&logo=express" alt="Express"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"></a>
  <a href="https://mongoosejs.com"><img src="https://img.shields.io/badge/Mongoose-8.4-880000?style=for-the-badge&logo=mongoose" alt="Mongoose"></a>
  <a href="https://bullmq.io"><img src="https://img.shields.io/badge/BullMQ-5.58-FF4500?style=for-the-badge&logo=redis" alt="BullMQ"></a>
  <a href="https://redis.io"><img src="https://img.shields.io/badge/Redis-ioredis-DC382D?style=for-the-badge&logo=redis" alt="Redis"></a>
  <a href="https://stripe.com"><img src="https://img.shields.io/badge/Stripe-v18-008CDD?style=for-the-badge&logo=stripe" alt="Stripe"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License"></a>
</p>

---

## 📖 Overview

**Ayrton95 Backend (Mekacar API)** is an enterprise-grade automotive e-commerce and workshop service booking platform. Built with Express.js, TypeScript, Mongoose, and Redis/BullMQ, it orchestrates vehicle sales, auto parts inventory, mechanic service slot reservations, real-time customer-provider WebSockets messaging, automated background notification workers, and Stripe financial settlements.

---

## ⚡ Key Features

- **🚗 Dealership & Auto Parts Marketplace:** Comprehensive catalog management for vehicles, aftermarket parts, inventory levels, category taxonomies, and verified customer reviews.
- **🔧 Mechanic Service & Slot Scheduling:** Multi-step workshop appointment booking with dynamic time-slot allocation and availability management.
- **⚡ BullMQ Background Queue & Worker:** Dedicated notification worker process (`src/workers/notificationWorker.ts`) backed by Redis and Bull-Board dashboard for asynchronous queue processing.
- **💬 Real-Time WebSockets Messaging:** Low-latency bidirection room-based chat between vehicle buyers, sellers, and mechanic technicians.
- **💳 Stripe Payment Processing:** Secure checkout and webhook processing for vehicle down-payments, auto parts orders, and service deposits.
- **☁️ DigitalOcean Spaces Asset Delivery:** High-speed cloud asset storage with CDN distribution for vehicle galleries, product diagrams, and inspection invoices.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    Client[Web & Mobile Clients] -->|HTTPS REST| Express[Express.js API Router]
    Client <-->|WebSockets| WS[WS Real-Time Gateway]

    subgraph Service_Pipeline ["Modular Service Pipeline"]
        Express --> Auth[Auth & Role Guard]
        Express --> CarStore[Car Store & Dealership]
        Express --> Parts[Auto Parts & Reviews]
        Express --> Booking[Mechanic Service & Slots]
        Express --> Billing[Stripe Payments]
    end

    subgraph Async_Engine ["Asynchronous Processing Engine"]
        Booking & Billing --> BullQueue[BullMQ Queue]
        BullQueue --> Redis[(Redis Key-Value Store)]
        Redis --> Worker[Notification Background Worker]
        Worker --> FCM[Firebase Push Notification]
        Worker --> SMTP[Nodemailer Email Service]
    end

    subgraph Persistence ["Data Store"]
        Service_Pipeline --> Mongoose[Mongoose ODM]
        Mongoose --> MongoDB[(MongoDB Database)]
    end
```

---

## 🗂️ Project Structure

```
ayrton95_backend/
├── assets/
│   └── banner.svg                  # Repository banner
├── src/
│   ├── app/
│   │   ├── config/                 # Config loader & environment bindings
│   │   ├── middlewares/            # Auth, file upload, error handling
│   │   ├── modules/
│   │   │   ├── auth/               # User authentication & JWT
│   │   │   ├── carbook/            # Vehicle booking & transactions
│   │   │   ├── carstore/           # Vehicle catalog & inventory
│   │   │   ├── parts/              # Auto parts store
│   │   │   ├── partsbooking/       # Auto parts checkout
│   │   │   ├── service/            # Workshop mechanic services
│   │   │   ├── slots/              # Time-slot appointment availability
│   │   │   ├── socket/             # WebSockets server integration
│   │   │   └── user/               # User profile administration
│   │   ├── routes/                 # Central API route index
│   │   └── utils/                  # Spaces uploader, FCM, helpers
│   ├── workers/
│   │   └── notificationWorker.ts   # BullMQ background worker
│   ├── app.ts                      # Express app initialization
│   └── server.ts                   # HTTP & WebSocket server listener
├── package.json
└── tsconfig.json
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js 20 & Express 4** | Core backend HTTP API runtime |
| **TypeScript 5.3** | Static typing and interface definitions |
| **Mongoose 8.4** | MongoDB object modeling and document validation |
| **BullMQ 5.58 & Redis** | Distributed message queues and background workers |
| **WebSockets (`ws`)** | Real-time chat and instantaneous customer support |
| **Stripe SDK 18** | Payment processing and billing webhooks |
| **DigitalOcean Spaces (AWS SDK v3)** | Cloud storage and asset CDN integration |
| **Nodemailer** | Transactional email dispatches |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- MongoDB instance (MongoDB 6+)
- Redis instance (Redis 6+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shahjalal-labs/ayrton95_backend.git
   cd ayrton95_backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Provide your MongoDB URI, Redis host/port, and Stripe/DigitalOcean credentials.

4. Start development server (runs both API and notification worker concurrently):
   ```bash
   npm run dev
   ```

5. Build and launch for production:
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
