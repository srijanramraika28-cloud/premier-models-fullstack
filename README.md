# 🌟 PREMIER MODEL MANAGEMENT — FULL STACK APPLICATION

A complete, production-ready Full Stack Web Application inspired by the high-fashion editorial agency **Premier Model Management London**. Built with a robust **Node.js & Express REST API backend**, **MongoDB (Mongoose)** database, **JWT Authentication & RBAC (Role-Based Access Control)**, and an interactive **editorial frontend**.

---

## 📌 Project Highlights & Requirements Checklist

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **1. Frontend & Backend** | Express.js API backend (`server/`) + Interactive UI (`client/`) | ✅ Completed |
| **2. REST APIs** | Full CRUD for Models, Blogs, Bookings & User Authentication | ✅ Completed |
| **3. MongoDB Database** | Mongoose Schemas for `User`, `Model`, `Blog`, `Booking` | ✅ Completed |
| **4. Authentication & RBAC** | JWT signed tokens, password hashing with `bcryptjs`, Roles: `admin` & `client` | ✅ Completed |
| **5. Clean Code & Architecture** | MVC (Model-View-Controller) structure, error middleware, async/await | ✅ Completed |
| **6. Git & GitHub** | Clean repository structure, `.gitignore`, production ready | ✅ Completed |
| **7. Testing** | Verified end-to-end API & frontend serving | ✅ Completed |
| **8. Deployment** | Ready for 1-click deployment on Render, Railway, AWS, or Vercel | ✅ Completed |

---

## 🏗️ Architecture & Technology Stack

- **Runtime**: Node.js (v18+)
- **Backend Framework**: Express.js (v4.21+)
- **Database**: MongoDB with Mongoose ODM (Auto in-memory for instant testing + MongoDB Atlas support)
- **Security & Authentication**: JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS
- **Frontend**: Semantic HTML5, Editorial CSS3 (Gilroy / Space Grotesk / Monument styling), Modular JavaScript (Fetch API)
- **Iconography**: Remix Icon (`cdn.jsdelivr.net`)
- **Assets**: Background video, high-resolution fashion editorial imagery, vector indicators

---

## 📂 Project Folder Structure

```text
premier-models-fullstack/
├── .env.example             # Template for environment configuration
├── .env                     # Local environment variables (Port, MongoDB URI, JWT Secret)
├── .gitignore               # Ignored files for Git (node_modules, .env, logs)
├── package.json             # Project metadata, dependencies, and NPM scripts
├── README.md                # Complete documentation, setup, and viva guide
│
├── server/                  # 🖥️ BACKEND (Express & MongoDB)
│   ├── index.js             # Main server entry point & static asset server
│   ├── config/
│   │   └── db.js            # MongoDB connection (Atlas & In-Memory fallback)
│   ├── models/              # Mongoose Data Schemas
│   │   ├── User.js          # User account (name, email, password hash, role)
│   │   ├── Model.js         # Model comp card (name, gender, category, stats, letter)
│   │   ├── Blog.js          # Editorial updates (title, author, content, tags)
│   │   └── Booking.js       # Client casting inquiries (project details, status)
│   ├── controllers/         # Business Logic
│   │   ├── authController.js    # Register, login, profile, user directory
│   │   ├── modelController.js   # Filter by A-Z / gender, search, create, update, delete
│   │   ├── blogController.js    # Articles list, create, edit, delete
│   │   └── bookingController.js # Submit casting inquiry, admin status management
│   ├── routes/              # Express REST Route Handlers
│   │   ├── authRoutes.js    # /api/auth/*
│   │   ├── modelRoutes.js   # /api/models/*
│   │   ├── blogRoutes.js    # /api/blogs/*
│   │   └── bookingRoutes.js # /api/bookings/*
│   ├── middleware/          # Security & Error Middleware
│   │   ├── authMiddleware.js    # Protect routes with JWT & Role verification
│   │   └── errorMiddleware.js   # Global error handling and 404 catcher
│   └── seed/                # Automated Database Seeder
│       ├── seed.js          # Seeder execution script
│       └── seedData.js      # Initial 26 models (A-Z), blogs, and accounts
│
└── client/                  # 🎨 FRONTEND (Editorial UI)
    ├── index.html           # Main SPA HTML structure & Modals
    ├── style.css            # Custom editorial styling & animations
    ├── assets/              # Static media
    │   ├── video.mp4        # Hero video
    │   ├── arrow.png        # Overlay explore arrow
    │   └── arrow2.png       # Editorial arrow
    └── js/                  # Frontend Scripts
        ├── api.js           # REST API client & JWT storage helper
        ├── admin.js         # Admin dashboard controller (CRUD)
        └── app.js           # Interactive UI, filter by A-Z, modal popups, auth
```

---

## ⚡ Quick Start Guide (Run Locally)

### 1. Install Dependencies
Open your terminal inside the project directory:
```bash
cd premier-models-fullstack
npm install
```

### 2. Configure Environment Variables (`.env`)
The project includes a ready-to-use `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=premier_models_super_secret_jwt_key_2026
JWT_EXPIRE=7d
```
> **Tip:** If `MONGODB_URI` is left blank, the app **automatically initializes an in-memory MongoDB** so you can start testing immediately with **ZERO configuration required**!
> To connect your permanent cloud database, simply paste your **MongoDB Atlas** connection string into `MONGODB_URI`.

### 3. Seed Database (Optional / Automatic)
The server auto-seeds if the database is empty, or you can run it manually:
```bash
npm run seed
```

### 4. Start the Application
```bash
npm start
```
Or for auto-reload during development:
```bash
npm run dev
```

### 5. Open in Your Browser
- Application URL: [http://localhost:5000](http://localhost:5000)
- REST API Health Check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Credentials (For Viva / Evaluation)

Use these one-click buttons inside the **SIGN IN** modal:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@premiermodels.com` | `Admin@123` | Full CRUD access to Models, Blogs, and Booking Inquiries |
| **Client** | `casting@vogue.com` | `Client@123` | Browse models, filter by A-Z, submit casting inquiries |

---

## 📡 REST API Documentation

### 1. Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` — Register a new client user.
- `POST /api/auth/login` — Login with email & password, returns JWT token.
- `GET /api/auth/me` — *(Protected)* Get profile of logged-in user.
- `GET /api/auth/users` — *(Admin Only)* View all registered users.

### 2. Models Endpoints (`/api/models`)
- `GET /api/models` — Get all models. Supports query filters:
  - `?letter=A` (Filter by first letter A through Z)
  - `?gender=female` or `?gender=male`
  - `?search=hannah` (Search by name or category)
- `GET /api/models/:id` — Get single model portfolio details.
- `POST /api/models` — *(Admin Only)* Add a new model to roster.
- `PUT /api/models/:id` — *(Admin Only)* Update model profile.
- `DELETE /api/models/:id` — *(Admin Only)* Delete a model from database.

### 3. Editorial & Blog Endpoints (`/api/blogs`)
- `GET /api/blogs` — Get all editorial articles and news.
- `GET /api/blogs/:id` — Get single article.
- `POST /api/blogs` — *(Admin Only)* Publish new editorial story.
- `PUT /api/blogs/:id` — *(Admin Only)* Edit article.
- `DELETE /api/blogs/:id` — *(Admin Only)* Remove article.

### 4. Casting Inquiries & Bookings (`/api/bookings`)
- `POST /api/bookings` — Submit a casting / booking inquiry for a model.
- `GET /api/bookings` — *(Admin Only)* View all casting inquiries.
- `PUT /api/bookings/:id/status` — *(Admin Only)* Update inquiry status (`Pending`, `Confirmed`, `Declined`, `Completed`).
- `DELETE /api/bookings/:id` — *(Admin Only)* Delete inquiry.

---

## 🚀 Deployment Guide

### Option 1: Deploy on Render (Recommended for Full Stack)
1. Push your repository to **GitHub**.
2. Go to [Render.com](https://render.com) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `<Your MongoDB Atlas connection string>`
   - `JWT_SECRET` = `<Your Secret String>`
6. Click **Create Web Service**. Render builds and deploys your application to a live public URL (e.g. `https://premier-models.onrender.com`)!

### Option 2: Deploy on Railway
1. Go to [Railway.app](https://railway.app) and click **New Project > Deploy from GitHub Repo**.
2. Select your repository.
3. In variables, add `MONGODB_URI` and `JWT_SECRET`.
4. Railway will automatically detect Node.js, run `npm start`, and provide a public domain.

### Option 3: Deploy on AWS (EC2)
1. Launch an Ubuntu EC2 instance on AWS Console.
2. SSH into your instance:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```
3. Install Node.js, Git, and PM2:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm git
   sudo npm install -g pm2
   ```
4. Clone your project:
   ```bash
   git clone https://github.com/your-username/premier-models.git
   cd premier-models
   npm install
   ```
5. Create `.env` with your MongoDB Atlas URI.
6. Start using PM2 daemon:
   ```bash
   pm2 start server/index.js --name "premier-models"
   pm2 startup
   ```

---

## 🎓 Teacher / Viva Defense Guide

Use this cheatsheet when explaining your project to your teacher or interviewer:

### Q1: What is the architecture of your application?
> *"Our project follows the classic 3-tier MVC (Model-View-Controller) architecture. The client tier is an interactive, responsive frontend. The server tier is built with Node.js and Express.js which exposes RESTful API endpoints for authentication, models roster, editorial blogs, and casting inquiries. The database tier uses MongoDB managed through Mongoose for schema modeling, validation, and data persistence."*

### Q2: How does authentication and authorization (RBAC) work?
> *"When a user or admin logs in via `POST /api/auth/login`, we verify their password using `bcryptjs.compare()`. Once verified, the server generates a signed JSON Web Token (JWT) containing the user ID and their role (`client` or `admin`). On the client side, this token is sent in the `Authorization: Bearer <token>` header on subsequent requests. Our backend `authMiddleware` verifies the token's signature, and the `authorize('admin')` middleware ensures that only users with the admin role can create, update, or delete models and view client booking inquiries."*

### Q3: How did you connect your original HTML/CSS with the backend?
> *"We integrated our bespoke editorial HTML & CSS by creating modular client-side JavaScript controllers using the browser's native `fetch()` API. When a user clicks any letter on our A-Z alphabet bar, the frontend fires a request to `/api/models?letter=X`. The backend queries MongoDB, and the frontend dynamically re-renders model comp cards into the DOM. We also added interactive modals for comp cards, booking forms, client registration, and an admin management dashboard."*

### Q4: How is data validated in MongoDB?
> *"We defined strict Mongoose schemas with required field checks, regex email validation, string trimming, enum restrictions (such as gender and booking statuses), and pre-save hooks (like hashing passwords before saving and automatically setting the alphabet letter from the model's name)."*
