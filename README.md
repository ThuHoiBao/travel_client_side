# Future Travel — Client-Side Application

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Router-7.8.2-CA4245?style=for-the-badge&logo=reactrouter" alt="React Router" />
  <img src="https://img.shields.io/badge/Ant_Design-5.29.1-0170FE?style=for-the-badge&logo=antdesign" alt="Ant Design" />
  <img src="https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?style=for-the-badge&logo=bootstrap" alt="Bootstrap" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture & Data Flow](#architecture--data-flow)
- [Pages & Routing](#pages--routing)
- [Authentication & Authorization](#authentication--authorization)
- [Backend Communication](#backend-communication)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)

---

## Overview

**Future Travel** is an online tour booking web application built with React 18 and TypeScript. The system delivers a complete experience for customers — from searching and viewing tour details to booking and payment — while providing a full-featured admin dashboard for back-office management.

The application communicates with a Spring Boot backend via RESTful API and real-time WebSocket, and integrates an AI-powered chatbot for intelligent tour recommendations.

---

## Features

### For Customers

| Feature | Description |
|---------|-------------|
| **Home Page** | Featured tours, popular destinations, promotional banners |
| **Tour Search** | Filter by destination, budget, transport type, rating, and date range |
| **Tour Detail** | Full information: itinerary, image gallery, departure calendar, reviews, related tours |
| **Tour Booking** | Multi-passenger booking form with coupon codes and loyalty point redemption |
| **Payment** | Pay via VNPay / PayOS with countdown timer and status tracking |
| **User Profile** | Update personal info, change avatar, view transaction history |
| **Favourite Tours** | Save and manage a personal list of favourite tours |
| **Refund Request** | Submit bank account details for refunds on cancelled bookings |
| **Tour Reviews** | Write and submit reviews after completing a trip |
| **AI Chatbot** | Intelligent tour Q&A powered by Google Gemini AI |
| **Real-time Notifications** | Instant alerts delivered via WebSocket |

### For Admins

| Feature | Description |
|---------|-------------|
| **Dashboard** | Revenue statistics, booking counts, and new user metrics |
| **Tour Management** | Full CRUD for tours including image and video uploads |
| **Departure Management** | Create, clone, and update pricing and transport for each departure |
| **User Management** | Search users and update account status |
| **Booking Management** | View, search, and update booking statuses |
| **Coupon Management** | Create and manage global or departure-specific discount coupons |
| **Location Management** | CRUD for destinations and location image uploads |
| **Branch & Policy Management** | Branch contact info and cancellation/refund policy templates |
| **Admin Notifications** | Manage and send system-wide notifications |
| **AI Analytics** | AI-assisted business data analysis on the dashboard |

---

## Tech Stack

### Core

| Library | Version | Purpose |
|---------|---------|---------|
| [React](https://reactjs.org/) | 18.3.1 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 4.9.5 | Static type safety |
| [React Router DOM](https://reactrouter.com/) | 7.8.2 | Client-side routing |
| [Create React App](https://create-react-app.dev/) | 5.0.1 | Build toolchain |

### UI & Styling

| Library | Version | Purpose |
|---------|---------|---------|
| [Ant Design](https://ant.design/) | 5.29.1 | Primary component library |
| [Bootstrap](https://getbootstrap.com/) | 5.3.8 | Responsive grid & utilities |
| [React Bootstrap](https://react-bootstrap.github.io/) | 2.10.10 | Bootstrap React components |
| [Lucide React](https://lucide.dev/) | 0.542.0 | Icon library |
| [React Icons](https://react-icons.github.io/) | 5.5.0 | Additional icons |
| [FontAwesome](https://fontawesome.com/) | 7.0.1 | Additional icons |
| [Swiper](https://swiperjs.com/) | 11.2.10 | Carousel & slider |
| [Tippy.js](https://atomiks.github.io/tippyjs/) | 4.2.6 | Tooltips & popovers |
| [SASS](https://sass-lang.com/) | 1.96.0 | CSS preprocessor |

### Forms & Input

| Library | Version | Purpose |
|---------|---------|---------|
| [React Select](https://react-select.com/) | 5.10.2 | Advanced dropdown select |
| [React DatePicker](https://reactdatepicker.com/) | 8.10.0 | Date picker |
| [React iMask](https://imask.js.org/) | 7.6.1 | Input masking (phone, card numbers) |
| [RC Slider](https://slider-react-component.vercel.app/) | 11.1.9 | Price range slider |

### Data & State Management

| Library | Version | Purpose |
|---------|---------|---------|
| [Axios](https://axios-http.com/) | 1.13.2 | HTTP client with interceptors |
| [Redux Toolkit](https://redux-toolkit.js.org/) | 2.8.2 | Global state management (ready to scale) |
| [React Redux](https://react-redux.js.org/) | 9.2.0 | Redux bindings for React |
| [Recharts](https://recharts.org/) | 3.6.0 | Dashboard charts & graphs |
| [date-fns](https://date-fns.org/) | 4.1.0 | Date utility functions |
| [Fuse.js](https://fusejs.io/) | 7.1.0 | Client-side fuzzy search |

### Real-time & Authentication

| Library | Version | Purpose |
|---------|---------|---------|
| [StompJS](https://stomp-js.github.io/) | 7.2.1 | STOMP messaging over WebSocket |
| [SockJS Client](https://github.com/sockjs/sockjs-client) | 1.6.1 | WebSocket fallback transport |
| [Socket.io Client](https://socket.io/) | 4.8.1 | Alternative WebSocket client |
| [@react-oauth/google](https://github.com/MomenSherif/react-oauth) | 0.12.2 | Google OAuth 2.0 |

### UI Utilities

| Library | Version | Purpose |
|---------|---------|---------|
| [React Toastify](https://fkhadra.github.io/react-toastify/) | 11.0.5 | Toast notifications |
| [React Confetti](https://github.com/alampros/react-confetti) | 6.4.0 | Celebration effect on successful payment |
| [React Quill](https://zenoamaro.github.io/react-quill/) | 2.0.0 | Rich text editor for admin |
| [React Markdown](https://github.com/remarkjs/react-markdown) | 10.1.0 | Markdown rendering in chatbot |

---

## Prerequisites

- **Node.js** ≥ 16.x
- **npm** ≥ 8.x or **yarn** ≥ 1.22
- The [Tourism_Backend](../Tourism_Backend/README.md) server running at `http://localhost:8080`

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd client-side
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:8080
```

### 4. Start the development server

```bash
npm start
```

The application will be available at: **http://localhost:3000**

### 5. Build for production

```bash
npm run build
```

The optimised output will be generated in the `/build` directory.

### 6. Run tests

```bash
npm test
```

---

## Project Structure

```
client-side/
├── public/                         # Static assets & index.html
├── src/
│   ├── assets/
│   │   ├── fonts/                  # Custom fonts
│   │   └── images/                 # Static images
│   │
│   ├── components/
│   │   ├── AdminComponent/         # Full admin panel
│   │   │   ├── AdminLayout/        # Admin layout (sidebar, header)
│   │   │   ├── AdminProtectedRoute.jsx
│   │   │   ├── AdminProfile.jsx
│   │   │   └── Pages/
│   │   │       ├── BookingsPage/   # Booking management
│   │   │       ├── BranchPolicyPage/ # Branches & policies
│   │   │       ├── CounsPage/      # Coupon management
│   │   │       ├── DashboardPage/  # Analytics & statistics
│   │   │       ├── DepartureManagement/ # Departure scheduling
│   │   │       ├── LocationsPage/  # Destination management
│   │   │       ├── NotificationsPage/ # System notifications
│   │   │       ├── ToursPage/      # Tour management
│   │   │       └── UsersPage/      # User management
│   │   │
│   │   ├── BookingPaymentComponent/ # Payment & result pages
│   │   │   ├── BookingPayment.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── PaymentFailed.jsx
│   │   │   ├── PaymentError.jsx
│   │   │   └── PaymentWaitingPage.jsx
│   │   │
│   │   ├── ChatbotWidget/          # AI chatbot widget
│   │   │   ├── ChatbotWidget.jsx
│   │   │   └── chatbotUtils.js
│   │   │
│   │   ├── Commons/                # Shared/reusable components
│   │   │   └── ConfirmModal.jsx
│   │   │
│   │   ├── DestinationSearchComponent/ # Destination search
│   │   ├── FooterComponent/        # Global footer
│   │   ├── HeaderComponent/        # Global header
│   │   ├── homPageComponent/       # Home page sections
│   │   │
│   │   ├── InformationComponent/   # User profile area
│   │   │   ├── FavoriteTours/      # Favourite tours list
│   │   │   ├── PersonalProfile/    # Personal info editor
│   │   │   ├── SidebarMenu/        # Navigation sidebar
│   │   │   └── TransactionList/    # Transaction history
│   │   │       └── TransactionListItem/
│   │   │           └── RefundInfoModal/ # Refund request modal
│   │   │
│   │   ├── LayoutComponent/
│   │   │   └── MainLayout.jsx      # Main layout (with header/footer)
│   │   │
│   │   ├── Login/                  # Login page
│   │   ├── RegisterComponent/      # Registration page
│   │   ├── TourBookingComponent/   # Tour booking form
│   │   │   ├── DateInput/
│   │   │   ├── PointRedemption/    # Loyalty point redemption
│   │   │   └── TourBooking.jsx
│   │   │
│   │   ├── TourDetailComponent/    # Tour detail page
│   │   │   ├── ImageModal/         # Image gallery modal
│   │   │   ├── RelatedTours/       # Related tour suggestions
│   │   │   ├── TourCalendar/       # Departure calendar
│   │   │   ├── TourInformation/    # General tour info
│   │   │   ├── TourItinerary/      # Day-by-day itinerary
│   │   │   ├── TourPolicy/         # Tour policies
│   │   │   └── TourReview/         # Reviews & ratings
│   │   │
│   │   ├── toursPageComponent/     # Tour listing page
│   │   ├── VerifyEmail/            # Email verification
│   │   └── ProtectedRoute.jsx      # User-level route guard
│   │
│   ├── context/
│   │   └── AuthContext.jsx         # Global authentication state
│   │
│   ├── data/
│   │   └── vietnam-provinces.json  # Vietnamese province data
│   │
│   ├── dto/
│   │   ├── requestDTO/             # Outgoing request type definitions
│   │   └── responseDTO/            # Incoming response type definitions
│   │
│   ├── hook/                       # Custom React hooks
│   │   ├── useAdminBookings.ts
│   │   ├── useAdminUsers.ts
│   │   ├── useBookings.ts
│   │   ├── useDashboard.ts
│   │   ├── useFavoriteDestinations.ts
│   │   ├── useFeaturedTours.ts
│   │   ├── useLocations.ts
│   │   ├── useSpecialTours.ts
│   │   ├── useUser.ts
│   │   └── useWebSocket.ts
│   │
│   ├── services/                   # API service layer
│   │   ├── api.ts                  # Centralised API client
│   │   ├── mapbox.ts               # Mapbox integration
│   │   ├── websocket.js            # WebSocket client
│   │   ├── booking/
│   │   ├── dashboard/
│   │   ├── favoriteTour/
│   │   ├── location/
│   │   ├── payment/
│   │   ├── review/
│   │   ├── tours/
│   │   └── user/
│   │
│   ├── utils/
│   │   ├── axiosCustomize.js       # Axios instance with interceptors
│   │   └── ScrollToTop.jsx         # Scroll-to-top on route change
│   │
│   ├── App.tsx                     # Root component & route definitions
│   ├── index.tsx                   # Application entry point
│   ├── App.css
│   └── index.css
│
├── .env                            # Environment variables
└── package.json
```

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       React Application                     │
│                                                             │
│  ┌─────────────┐   ┌──────────────┐   ┌───────────────┐   │
│  │  Components │◄─►│ Custom Hooks │◄─►│   Services /  │   │
│  │  (UI Layer) │   │ (Data Layer) │   │   API Client  │   │
│  └─────────────┘   └──────────────┘   └───────┬───────┘   │
│         │                 │                    │            │
│  ┌──────▼─────────────────▼────────┐           │            │
│  │         Context API             │           │            │
│  │  (AuthContext — Global State)   │           │            │
│  └─────────────────────────────────┘           │            │
│                                                │            │
└────────────────────────────────────────────────┼────────────┘
                                                 │
                          ┌──────────────────────▼──────────┐
                          │         Backend API             │
                          │   Spring Boot — localhost:8080  │
                          │                                 │
                          │  ┌──────────┐  ┌────────────┐  │
                          │  │ REST API  │  │ WebSocket  │  │
                          │  │  (HTTP)   │  │  (STOMP)   │  │
                          │  └──────────┘  └────────────┘  │
                          └─────────────────────────────────┘
```

### State Management

| Approach | Scope | Data |
|----------|-------|------|
| **Context API** | Global | User session, authentication state |
| **Custom Hooks** | Component-level | API data, loading & error states |
| **Local State** | Component | Form data, UI-specific state |
| **Redux Toolkit** | Global (ready to scale) | Installed and available for future use |

---

## Pages & Routing

### Public Routes (with Header/Footer)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Landing page |
| `/tours` | `ToursPage` | Tour listing & search |
| `/tour/:tourCode` | `TourDetail` | Tour detail page |
| `/order-booking` | `TourBooking` | Tour booking form |
| `/payment-booking` | `BookingPayment` | Payment page |
| `/payment-success` | `PaymentSuccess` | Payment success confirmation |
| `/payment-failed` | `PaymentFailed` | Payment failure page |
| `/payment-waiting` | `PaymentWaitingPage` | Awaiting payment confirmation |
| `/payment-error` | `PaymentError` | Payment error page |
| `/information` | `InformationComponent` | User profile area |
| `/information/:tab` | `InformationComponent` | Specific profile tab |
| `/register` | `Register` | Account registration |
| `/login` | `Login` | User login |
| `/verify-email` | `VerifyEmail` | Email verification |

### Admin Routes (no Header/Footer, requires ADMIN role)

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/login` | `AdminLogin` | Admin login |
| `/admin/dashboard` | `DashboardPage` | Analytics dashboard |
| `/admin/profile` | `AdminProfile` | Admin profile |
| `/admin/tours` | `ToursPage (Admin)` | Tour management |
| `/admin/departures` | `DepartureList` | Departure management |
| `/admin/users` | `UsersPage` | User management |
| `/admin/bookings` | `BookingsPage` | Booking management |
| `/admin/coupons` | `CouponManagement` | Coupon management |
| `/admin/locations` | `LocationManager` | Location management |
| `/admin/branches-policies` | `BranchPolicyManagement` | Branches & policies |
| `/admin/notifications` | `NotificationsPage` | System notifications |

---

## Authentication & Authorization

### Authentication Flow

```
User
 │
 ├── Email / Password login ──► POST /api/auth/login
 │                                       │
 └── Google OAuth login     ──► POST /api/auth/google/login
                                         │
                                  ┌──────▼──────┐
                                  │  JWT Tokens  │
                                  │  accessToken  (15 min)
                                  │  refreshToken (7 days)
                                  └──────┬──────┘
                                         │ Stored in localStorage
                                  ┌──────▼──────────┐
                                  │   AuthContext   │
                                  │  isAuthenticated│
                                  │  user profile   │
                                  └─────────────────┘
```

### Automatic Token Refresh

The Axios interceptor handles this transparently:
1. Detects a `401 Unauthorized` response
2. Calls `POST /api/auth/refresh-token` with the stored refresh token
3. Updates the `accessToken` in localStorage
4. Automatically retries the original request
5. On refresh failure → logs the user out and redirects to `/login`

### Route Guards

```jsx
// User-level protected route (requires login)
<ProtectedRoute>
  <InformationComponent />
</ProtectedRoute>

// Admin-level protected route (requires ADMIN role)
<AdminProtectedRoute>
  <DashboardPage />
</AdminProtectedRoute>
```

---

## Backend Communication

### REST API

**Base URL:** `http://localhost:8080/api`

**Axios configuration** (`src/utils/axiosCustomize.js`):
- Automatically attaches `Bearer <accessToken>` to every request header
- Automatically refreshes the token on `401` responses
- Centralised error handling with toast notifications

### WebSocket (Real-time)

**Endpoint:** `http://localhost:8080/ws` (STOMP over SockJS)

```javascript
// Subscribe to user notifications
stompClient.subscribe('/topic/user/<userId>', callback);

// Subscribe to booking status updates
stompClient.subscribe('/topic/booking/<bookingCode>', callback);
```

### API Groups

| Group | Endpoint | Description |
|-------|----------|-------------|
| Auth | `/api/auth/*` | Login, register, token refresh |
| Tours | `/api/tours/*` | Browse, search, tour details |
| Booking | `/api/bookings/*` | Create booking, cancel, refund |
| Payment | `/api/payment/*` | Initiate payment, callbacks |
| User | `/api/users/*` | Profile, update info |
| Reviews | `/api/reviews/*` | Submit and view reviews |
| Notifications | `/api/notifications/*` | User notifications |
| Chatbot | `/api/chatbot/*` | AI Q&A |
| Admin | `/api/admin/*` | All admin operations |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:8080` | Backend API base URL |

> **Security note:** For production, move the Google OAuth Client ID out of `src/index.tsx` and into the environment variable `REACT_APP_GOOGLE_CLIENT_ID`.

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `npm start` | Start dev server at port 3000 |
| **Production Build** | `npm run build` | Optimised build output to `/build` |
| **Test** | `npm test` | Run Jest in interactive watch mode |
| **Eject** | `npm run eject` | Eject CRA config (irreversible) |

---

## Contact

For any inquiries, support, or feedback regarding the Future Travel system, please reach out to the development team:

* **Tran Anh Thu** 
    * Email: [trananhthu270904@gmail.com](mailto:trananhthu270904@gmail.com)
    * GitHub: [https://github.com/ThuHoiBao](https://github.com/ThuHoiBao)
* **Vuong Duc Thoai** 
    * Email: [thoai12309@gmail.com](mailto:thoai12309@gmail.com)
    * GitHub: [https://github.com/vuongducthoai](https://github.com/vuongducthoai)

---

<p align="center"> Future Travel </p>
