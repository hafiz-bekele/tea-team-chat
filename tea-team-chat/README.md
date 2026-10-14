# ☕ Tea Team Chat

**Where Conversations Spill the Real Tea**

A modern, real-time chat application built for Wollo University students to connect, collaborate, and grow together.

![Tea Team Chat](https://img.shields.io/badge/version-1.0.0-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

- ✅ User registration with email verification
- ✅ User login with JWT authentication
- ✅ Google OAuth integration
- ✅ Real-time messaging with Socket.io
- ✅ Online/offline status indicators
- ✅ Friend requests system
- ✅ Message delivery status
- ✅ Profile management
- ✅ Responsive Material-UI design with warm tea theme
- ✅ Group chat support
- ✅ Typing indicators
- ✅ Message reactions

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Passport.js for Google OAuth
- Nodemailer for email verification
- Bcrypt for password hashing

### Frontend
- React 18
- Material-UI (MUI)
- Socket.io Client
- Axios for API calls
- React Router for navigation
- React Hot Toast for notifications
- Formik & Yup for form validation

## 📁 Project Structure

```
tea-team-chat/
├── server/                 # Backend
│   ├── config/            # Configuration files
│   │   └── passport.js    # Passport Google OAuth config
│   ├── controllers/       # Route controllers
│   │   └── authController.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # JWT authentication
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Group.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── messages.js
│   │   └── groups.js
│   ├── .env.example       # Environment variables template
│   ├── package.json
│   └── server.js          # Entry point
│
└── client/                # Frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/    # Reusable components
    │   │   └── PrivateRoute.js
    │   ├── context/       # React Context
    │   │   ├── AuthContext.js
    │   │   └── SocketContext.js
    │   ├── pages/         # Page components
    │   │   ├── Landing.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Chat.js
    │   │   ├── Profile.js
    │   │   ├── About.js
    │   │   └── Mission.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Google Cloud Console account (for OAuth)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/tea-team-chat.git
cd tea-team-chat
```

2. **Setup Backend**
```bash
cd server
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tea-team-chat
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:3000
SESSION_SECRET=your_session_secret_here
```

4. **Setup Frontend**
```bash
cd ../client
npm install
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

### Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this password in `EMAIL_PASS` in `.env`

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
```

## 📱 Features Overview

### Authentication
- Email/password registration with verification
- Login with JWT tokens
- Google OAuth integration
- Password reset functionality

### Real-time Chat
- One-on-one messaging
- Group chats
- Online/offline status
- Typing indicators
- Message delivery status (sent, delivered, read)
- File sharing support

### User Management
- Profile customization
- Friend requests
- Search users
- Block/unblock users

## 🎨 Design Theme

The application features a warm, inviting tea-themed design:
- Primary Color: `#F5A623` (Tea Orange)
- Secondary Color: `#8B6F47` (Tea Brown)
- Background: `#FFF8E7` (Tea Cream)
- Accent: `#90C695` (Tea Green)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- XSS protection
- Rate limiting (recommended for production)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search?query=` - Search users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile (bio, department, campus, social links)
- `GET /api/users/department/:deptName` - Discover peers in the same department

### Messages & Collaboration
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message
- `PUT /api/messages/:messageId/read` - Mark as read
- `GET /api/messages/search/:query` - Simple text search across messages
- `GET /api/messages/search/advanced/filter` - Filter messages by chat, type, keyword, and pagination
- `PUT /api/messages/:messageId/pin` - Toggle pin/unpin status on a message
- `GET /api/messages/pinned/:targetId` - Get all pinned messages in a conversation
- `PUT /api/messages/:messageId/star` - Bookmark/star a message
- `GET /api/messages/starred/saved` - View all personal bookmarked messages
- `PUT /api/messages/:messageId/reactions` - Add/toggle emoji reaction (`emoji`)

### Diagnostics & Verification
- `npm run test:db` (in `server/`) - Validate MongoDB Atlas credentials and IP whitelist connectivity
- `GET /api/health` - Real-time API and database status monitor

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create group
- `GET /api/groups/:groupId/messages` - Get group messages

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy from GitHub
3. Ensure MongoDB connection string is set

### Frontend (Vercel/Netlify)
1. Build the React app
2. Deploy the `build` folder
3. Set environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Samuel Ayalew** - Frontend Developer
- **Hana Tesfaye** - Backend Developer
- **Yared Girma** - UI/UX Designer

## 🙏 Acknowledgments

- Wollo University
- Material-UI for the component library
- Socket.io for real-time functionality
- All contributors and testers

## 📞 Support

For support, email teateamchat@wollo.edu or join our community chat.

---

Made with ☕ and ❤️ by the Tea Team
