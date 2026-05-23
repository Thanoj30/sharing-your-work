# Sharing Your Work

Sharing Your Work is a college-level MERN web project for community help-sharing around parcel delivery and grocery pickup.

This project is a college-level MERN application with authentication, dashboard routing, and a Parcel Help module.

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
- Vite for the React development server
- Tailwind CSS
- JSON Web Tokens for authentication
- bcryptjs for password hashing

## Project Structure

```text
sharing-your-work/
  client/
    public/
    src/
      assets/
      components/
        DashboardLayout.jsx
      pages/
        DashboardHome.jsx
        Friends.jsx
        Login.jsx
        NearbyUsers.jsx
        ParcelHelp.jsx
        PlaceholderPage.jsx
        Profile.jsx
        Register.jsx
      services/
        api.js
      styles/
        global.css
      App.jsx
      main.jsx
    .env.example
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
  server/
    src/
      config/
        db.js
      controllers/
        authController.js
        friendController.js
        parcelController.js
      middleware/
        authMiddleware.js
      models/
        Friendship.js
        ParcelActivity.js
        User.js
      routes/
        authRoutes.js
        friendRoutes.js
        parcelRoutes.js
      utils/
      app.js
      server.js
    .env.example
    package.json
  docs/
  .gitignore
  package.json
  README.md
```

## Prerequisites

Install these before starting:

- Node.js 20 or newer
- npm 10 or newer
- MongoDB installed locally, or a MongoDB Atlas connection string

## Installation

From the project root:

```bash
cd sharing-your-work
npm run install:all
```

This installs dependencies for:

- the root workspace scripts
- the React client
- the Express server

## Environment Setup

Create local environment files from the examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Then update the values in each `.env` file for your machine.

Server environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sharing-your-work
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

Client environment variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Development Commands

Run both client and server together:

```bash
npm run dev
```

Run only the client:

```bash
npm run dev:client
```

Run only the server:

```bash
npm run dev:server
```

## Auth API Routes

The server includes these authentication routes:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

`GET /api/auth/me` requires an `Authorization: Bearer <token>` header.

Authentication supports:

- registration with name, email, password, optional profile image, and optional contact info
- bcryptjs password hashing before saving users
- login with email and password
- JWT token generation after successful register/login
- protected API routes with JWT middleware
- protected dashboard routes in the React client
- logout by clearing `localStorage`

## Parcel API Routes

The server includes these parcel helper routes:

```text
GET  /api/parcels/helpers
POST /api/parcels/helpers
```

`POST /api/parcels/helpers` requires an `Authorization: Bearer <token>` header and stores the logged-in user's active parcel helper route in MongoDB.

## Friend API Routes

The server includes these friend system routes:

```text
GET   /api/friends/search?q=name-or-email
GET   /api/friends/requests
GET   /api/friends
POST  /api/friends/requests
PATCH /api/friends/requests/:requestId
```

All friend routes require an `Authorization: Bearer <token>` header.

## Client Auth Pages

The React client now includes:

```text
/login
/register
/dashboard
/dashboard/parcel-help
/dashboard/grocery-help
/dashboard/friends
/dashboard/nearby-users
/dashboard/messages
/dashboard/profile
/dashboard/settings
```

Login and register forms call the backend auth API using Axios. On success, the JWT token is stored in `localStorage` as `token`, the returned user is stored as `user`, and the user is redirected to `/dashboard`.

If an API request returns `401`, the client clears the stored token and user.

The dashboard uses a responsive left sidebar with React Router nested routes for each section.

The `/dashboard/parcel-help` page includes a route form and active helper cards.

The `/dashboard/grocery-help` page is a placeholder for a later step.

The `/dashboard/friends` page supports user search, friend requests, request accept/reject, and an accepted friends list.

The `/dashboard/nearby-users` page is a placeholder for future location-based discovery.

The `/dashboard/messages` page is a placeholder for a later step.

The `/dashboard/profile` page shows the logged-in user's profile details and latest `helpCount`.

## Planned Feature Areas

Future steps can add:

- user registration and login
- parcel delivery help requests
- grocery pickup help requests
- volunteer matching
- request status tracking
- ratings or feedback
- admin moderation

## Current Status

Completed in this step:

- base MERN folder structure
- setup files for React, Vite, and Tailwind CSS
- setup files for Express, MongoDB, JWT, and bcryptjs
- complete authentication flow
- login, register, profile, and protected dashboard pages
- responsive dashboard sidebar layout
- Parcel Help module with MongoDB-backed active helper routes
- Friends module with search, requests, and friends list
- Nearby Users placeholder page
- profile page with helpCount
- frontend auth API service
- JWT storage in localStorage
- environment examples
- installation and development instructions

Not implemented yet:

- Grocery Help module
- Messaging module
- task request and completion system
