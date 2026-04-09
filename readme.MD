# 🚀 OneCodeLive - Backend

Backend service for **OneCodeLive**, an online code compiler platform that allows users to write, execute, and test code in multiple programming languages.

This backend handles:
- Authentication (Signup, Login, Forgot Password)
- Code execution APIs
- Email-based password reset
- Core business logic for the application

---

## 🌐 Live Frontend

https://onecodelive.vercel.app/

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Email Service:** Nodemailer
- **Containerization:** Docker
- **BullMQ** Queue Job
- **Redis** Caching

---

## 📦 Features

- 🔐 User Authentication
  - Signup
  - Login
  - JWT-based authentication
  - Forgot Password (Email reset link)

- ⚡ Code Execution API
  - Run user-submitted code
  - Supports multiple programming languages

- 📧 Email Service
  - Send password reset links
  - EMAILJS integration

---

## 🔐 Environment Variables

```bash
DATABASE=""
PORT=5000
JWT_SECRET=""
EMAIL=""
EMAIL_PASS=""
CONTAINER_ID="code-runner"
EXECUTE_ON_DOCKER="false"
API_URL="localhost:5000"
FRONTEND_URL="localhost:3000"
EMAILJS_SERVICE_ID=""
EMAILJS_TEMPLATE_ID=""
EMAILJS_PUBLIC_KEY=""
EMAILJS_PRIVATE_KEY=""
```




## ⚙️ Getting Started (Docker Setup)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/devisinghlodhi/onlinecode_backend.git
cd onlinecode_backend
```

## 🐳 Docker Setup

### 2️⃣ Build Docker Image

```bash
docker buildx build --load -t my-node-app .
```

### 3️⃣ Run Docker Container
```bash
docker run -d -p 5000:5000 --name node-container my-node-app
```

### 4️⃣ Access Backend
Backend will run at:
```bash
👉 http://localhost:5000
```



