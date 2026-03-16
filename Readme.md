# 🎬 VideoTube Backend API

A **production-ready backend API** for a video streaming platform inspired by YouTube.  
Built using **Node.js, Express, MongoDB**, and modern backend architecture with security, scalability, and performance in mind.

---

# 🚀 Features

### 🔐 Authentication & Security

- JWT Authentication (**Access + Refresh Tokens**)
- Secure login & logout
- Password hashing using **bcrypt**
- Cookie-based authentication
- Protected routes with **JWT middleware**
- **Rate limiting** to prevent abuse

### 🎥 Video Management

- Video upload using **Cloudinary**
- Video CRUD operations
- Like system for videos
- Comment system

### 👥 Social Features

- Channel subscription system
- Playlist creation and management
- Tweet-style posts
- Like system for tweets and comments

### 📊 Dashboard & Analytics

- User dashboard statistics
- Video views tracking
- Subscriber count
- Likes aggregation

### 📁 Media Handling

- File uploads using **Multer**
- Cloud storage via **Cloudinary**

### ⚡ Performance & Architecture

- Clean **MVC architecture**
- Modular route structure
- MongoDB **aggregation pipelines**
- Pagination support

### 📚 Developer Experience

- **Swagger API documentation**
- Structured logging with **Winston**
- HTTP request logging with **Morgan**
- Centralized error handling
- Environment-based configuration

---

# 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Cloudinary**
- **Multer**
- **bcrypt**
- **dotenv**
- **Swagger**
- **Morgan**
- **Winston**
- **Express Rate Limit**

---

# 📁 Project Structure

src
│
├── controllers
├── models
├── routes
├── middlewares
├── utils
├── db
│
├── app.js
└── index.js

public
└── temp

logs

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory:

PORT=8000

MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN=\*

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

---

# ▶️ Installation

Clone the repository

```bash
git clone https://github.com/siddharthsharma983/videotube-backend.git
cd videotube-backend

## Install dependencies

npm install

## Start the development server

npm run dev

## Server runs on

http://localhost:8000

🔐 API Base URL

/api/v1

## Example endpoint

POST /api/v1/users/register

📘 API Documentation

Swagger documentation is available at:

http://localhost:8000/api-docs

🛡 Security Features

Rate limiting for API protection

Secure cookies

Password hashing

JWT token validation

Centralized error handling

📈 Logging

The project uses:

Morgan → HTTP request logging

Winston → structured application logs

Logs are stored inside:

logs/

📌 Project Status

✅ Core backend completed
✅ Authentication system implemented
✅ Video management APIs implemented
✅ Social features implemented
✅ Swagger documentation added
✅ Logging and security improvements added

🚧 Future improvements:

Redis caching

CI/CD pipeline

Deployment setup

WebSocket notifications

👨‍💻 Author

Siddharth Sharma

Full Stack Developer

Built with ❤️ using Node.js & MongoDB
```
