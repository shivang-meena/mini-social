# Mini Social App

A simple social media app where users can signup, create posts with text or images, like and comment on other peoples posts. Built this as a internship assignment using MERN stack.

🔗 **Live App:** [https://mini-social-delta.vercel.app](https://mini-social-delta.vercel.app)
🔗 **Backend API:** [https://mini-social-7o7f.onrender.com](https://mini-social-7o7f.onrender.com)
🔗 **GitHub Repo:** [https://github.com/shivang-meena/mini-social](https://github.com/shivang-meena/mini-social)

## What it does

- Signup and login with email and password (JWT auth)
- Create posts with text, image or both (either one is enough)
- Public feed where all posts from all users are visible
- Like and unlike any post
- Comment on posts, saves username of who commented
- Pagination — loads 10 posts at a time, load more button at bottom

## Tech Stack

**Frontend**
- React.js (Vite)
- React Bootstrap + custom CSS
- Axios for api calls
- React Router DOM for navigation
- Context API for auth state

**Backend**
- Node.js + Express
- MongoDB Atlas (database)
- Cloudinary (image uploads)
- JWT for authentication
- Multer + multer-storage-cloudinary
- Bcryptjs for password hashing

## Project Structure

```
mini-social/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CreatePost.jsx
    │   │   └── PostCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Feed.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── .env
```

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/posts | Create a post | Yes |
| GET | /api/posts | Get all posts (paginated) | No |
| POST | /api/posts/:id/like | Like or unlike a post | Yes |
| POST | /api/posts/:id/comment | Add comment on post | Yes |

## How to run locally

### Backend

1. Go to backend folder
```bash
cd backend
npm install
```

2. Create a `.env` file in backend folder
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

3. Start the server
```bash
npm run dev
```

### Frontend

1. Go to frontend folder
```bash
cd frontend
npm install
```

2. Create a `.env` file in frontend folder
```
VITE_API_URL=http://localhost:5000/api
```

3. Start the app
```bash
npm run dev
```

Now open http://localhost:5173 in your browser

## Database Design

Only 2 MongoDB collections used (as per requirement):

**Users collection** — stores name, username, email and hashed password

**Posts collection** — stores post text, image url, author info (userId + username + name), and array of likes and comments. Each like and comment also stores the username of who did it.

## Deployment

- Frontend hosted on **Vercel** — [https://mini-social-delta.vercel.app](https://mini-social-delta.vercel.app)
- Backend hosted on **Render** — [https://mini-social-7o7f.onrender.com](https://mini-social-7o7f.onrender.com)
- Database on **MongoDB Atlas**
- Images stored on **Cloudinary**

## Features I focused on

- Responsive UI that works on mobile, tablet and desktop
- Like toggle (click again to unlike)
- Comments section shows username of who commented
- Efficient pagination with load more button
- JWT stored in localStorage for persistent login session
- Images uploaded to Cloudinary so they dont disappear on server restart
- Protected routes — only logged in users can create posts or comment
- Clean modern UI inspired from social feed apps

## Some things I learned

Pagination was a bit confusing at first. Backend calculates totalPages and sends it in response, frontend just checks if current page is less than totalPages to decide whether to show load more button or not.

Also ran into a DNS issue with MongoDB Atlas on my local network, fixed it by switching DNS to 8.8.8.8 (Google DNS).

---

Made with ❤️ by Shivang Meena
