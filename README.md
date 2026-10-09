# ToolShare Backend

ToolShare connects people who need tools with owners who have tools available to borrow or rent. This repository contains the backend API for my MERN capstone project.

The API handles accounts, tool listings, and rental requests. Online payments are a future feature.

## Technologies

Node.js, Express, MongoDB, Mongoose, bcrypt, JSON Web Tokens, dotenv, cors, morgan, and nodemon.

## Features

- Account registration and login with hashed passwords.
- JWT authentication for protected routes.
- Full CRUD functionality for tool listings and rental requests.
- Ownership checks for editing and deleting listings.
- Incoming and outgoing rental requests.
- Approval, decline, cancellation, and return confirmation.
- Rental date validation and checks for overlapping bookings.
- MongoDB transactions to coordinate rental creation, approval, and tool deletion.
- Tools with rental history cannot be deleted. Owners can mark them unavailable instead.

## Local Setup

Run these commands from the backend folder:

```bash
npm install
cp .env.example .env
```

Update `.env` with your own values:

```env
PORT=3001
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER/toolshare
JWT_SECRET=YOUR_GENERATED_SECRET
FRONTEND_URL=http://localhost:5173
```

Generate a JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the generated value into `JWT_SECRET`. Keep `.env` private.

The application uses MongoDB transactions, so the database must support transactions, such as a MongoDB Atlas cluster.

Start the development server:

```bash
npm run dev
```

Start without nodemon:

```bash
npm start
```

Check the server:

```text
http://localhost:3001/health
```

## API Routes

Protected routes require this header:

```text
Authorization: Bearer YOUR_TOKEN
```

### Authentication

| Method | Route | Purpose | Protected |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account | No |
| POST | `/api/auth/login` | Log in and receive a token | No |
| GET | `/api/auth/me` | View the signed-in user | Yes |

### Tools

| Method | Route | Purpose | Protected |
|---|---|---|---|
| GET | `/api/tools` | Browse tool listings | No |
| GET | `/api/tools/mine` | View your listings | Yes |
| GET | `/api/tools/:id` | View one tool | No |
| POST | `/api/tools` | Create a listing | Yes |
| PATCH | `/api/tools/:id` | Update your listing | Yes |
| DELETE | `/api/tools/:id` | Delete your listing if it has no rental history | Yes |

### Rental Requests

| Method | Route | Purpose | Protected |
|---|---|---|---|
| GET | `/api/requests/outgoing` | View requests you submitted | Yes |
| GET | `/api/requests/incoming` | View requests for your tools | Yes |
| GET | `/api/requests/:id` | View a request you are involved in | Yes |
| POST | `/api/requests` | Submit a rental request | Yes |
| PATCH | `/api/requests/:id` | Edit your pending request | Yes |
| DELETE | `/api/requests/:id` | Delete your pending request | Yes |
| PATCH | `/api/requests/:id/approve` | Approve a request for your tool | Yes |
| PATCH | `/api/requests/:id/decline` | Decline a request for your tool | Yes |
| PATCH | `/api/requests/:id/cancel` | Cancel your pending request | Yes |
| PATCH | `/api/requests/:id/return` | Confirm the return of your tool | Yes |

## Models

- **User:** Account information and hashed password.
- **Tool:** Listing details, daily rate, availability, and owner.
- **RentalRequest:** Tool, borrower, owner, rental dates, message, and status.

## Testing

I manually tested the API using curl with separate owner and borrower accounts. Testing covered registration, login, tool CRUD, rental request CRUD, and the approval, decline, cancellation, and return workflows.

I also checked ownership restrictions, overlapping rental dates, invalid IDs, missing authentication, missing fields, invalid date ranges, malformed JSON, and unknown routes.

## Project Links

- [Backend repository](https://github.com/Fiyahblaze/ToolShare-Capstone-Project-Backend)
- [Frontend repository](https://github.com/Fiyahblaze/ToolShare-Capstone-Project-Frontend)

## Live Backend

- [Backend API](https://toolshare-capstone-project-backend.onrender.com)
- [Health Check](https://toolshare-capstone-project-backend.onrender.com/health)
- [Tool Listings](https://toolshare-capstone-project-backend.onrender.com/api/tools)

- [Live ToolShare App](https://toolshare-capstone-project-frontend.onrender.com)