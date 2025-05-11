# Node.js Authentication System with JWT and MongoDB (TypeScript)

## Overview

This is a simple yet robust authentication system built using **Node.js**, **Express**, **MongoDB (Atlas)**, and **JWT (JSON Web Tokens)**. The project uses **TypeScript** for better type safety and developer experience.

The system allows:
- Secure login using hashed passwords
- JWT-based authentication
- Secure password handling with `bcryptjs`
- MongoDB Atlas for remote DB connectivity
- Organized modular folder structure (auth, types, services, helpers)

---

## Technologies Used

- **Node.js** & **Express** - Backend server and routing
- **TypeScript** - Static typing, better IntelliSense, and fewer runtime errors
- **MongoDB Atlas** & **Mongoose** - Cloud database and ODM
- **JWT (jsonwebtoken)** - Stateless authentication
- **bcryptjs** - Password hashing and comparison
- **dotenv** - Environment variable management
- **CORS & Middleware** - API security and request parsing

---

## Why TypeScript?

TypeScript offers:
- Strong type-checking and reduced runtime errors
- Better autocompletion and refactoring in IDEs
- Clear interfaces (like `IUser`) for types and APIs
- Confidence in team scaling and production deployments

---

## Why JWT?

JWTs are a secure, stateless way to handle user authentication:
- Tokens are signed with a secret and stored client-side
- No session storage is required on the server
- Easy to include expiration and claims inside the token
- Perfect for APIs and microservices

---

## Project Structure

src/
│
├── auth/
│ ├── authRoute.ts # Express routes for login and me
│
├── helpers/
│ ├── authUtils.ts # Password hashing & comparison logic
│ └── token.ts # Encode/decode JWT logic
│
├── types/
│ └── user.ts # Mongoose schema for User
│
├── services/
│ └── db.ts # MongoDB connection logic
│
└── index.ts # Main Express server entry point


---

## Project Flow

1. **User Login**
   - Routes are defined under `auth/authRoute.ts`
   - Password is hashed using `bcryptjs` before saving to DB (`authUtils.ts`)
   - JWT is generated using `encodeAuthToken()` from `token.ts`

2. **Token Handling**
   - Upon login, a token is issued containing `sub` (userId), `iat`, and `exp`
   - Protected routes can verify and extract user info from the token

3. **MongoDB Connection**
   - `services/db.ts` connects to MongoDB Atlas using `MONGO_URI` from `.env`

4. **User Model**
   - Defined in `types/user.ts`
   - Password is automatically hashed using Mongoose pre-save hook
   - Includes method `comparePassword()` for validating login attempts

---

## Environment Variables

Create `.env.development` and/or `.env.production` files:

PORT=5000
MONGO_URI=your_mongo_atlas_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development

## How to Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Or build and run production
npm run build
node dist/index.js


## API Routes

- `GET /auth/me` 
- `POST /auth/login` – Login with username & password  
- `Authorization: Bearer <token>` – Use this header to access protected routes  
