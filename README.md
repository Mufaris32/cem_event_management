# 🎓 College Event Management System

A modern, user-friendly web application for managing and displaying college events. Built with React and powered by MongoDB and Cloudinary for reliable performance.

![College Events](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-orange?style=flat-square)

## 🌟 What This App Does

- **📅 Event Calendar** - View all upcoming events in a beautiful calendar interface
- **🎨 Event Gallery** - Browse past events with stunning photo galleries  
- **👨‍💼 Admin Dashboard** - Easy-to-use admin panel for managing events
- **📱 Mobile Friendly** - Works perfectly on phones, tablets, and computers
- **🔍 Search & Filter** - Find events quickly by category, date, or keywords

## 🚀 Quick Start Guide

### What You Need
- **Node.js** (version 16 or newer) - [Download here](https://nodejs.org/)
- **MongoDB** - [Install locally](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)
- **Cloudinary Account** - [Sign up free](https://cloudinary.com/) for image storage

### Step 1: Get the Code
```bash
git clone https://github.com/Mufaris32/cem_event_management.git
cd cem_event_management
npm install --legacy-peer-deps
```

### Step 2: Set Up Your Environment
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your details:
   ```env
   # Database (use local MongoDB or Atlas connection string)
   MONGODB_URI=mongodb://localhost:27017/cem_events

   # Cloudinary (get these from your Cloudinary dashboard)
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here

   # Server settings
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

### Step 3: Initialize the Database
```bash
npm run init:db
```
This creates sample events to get you started!

### Step 4: Start the Application
```bash
npm start
```

That's it! 🎉 
- **Your website**: http://localhost:5173
- **Admin panel**: http://localhost:5173/admin
- **API server**: http://localhost:5000

## 📋 How to Use

### For Visitors
1. Go to http://localhost:5173
2. Browse upcoming events on the homepage
3. Click "View Calendar" to see all events
4. Click "Gallery" to see photos from past events

### For Administrators
1. Go to http://localhost:5173/admin
2. Click "Add New Event" to create events
3. Upload photos and fill in event details
4. Events appear immediately on the public site

## 🛠️ Built With

**Frontend:**
- React 18 - Modern web framework
- Tailwind CSS - Beautiful styling
- Framer Motion - Smooth animations
- Vite - Fast development server

**Backend:**
- Node.js & Express - Server
- MongoDB - Database
- Cloudinary - Image storage
- Mongoose - Database management

## 📁 Project Structure

```
cem_event_management/
├── src/                    # Frontend code
│   ├── pages/             # Main app pages
│   ├── components/        # Reusable components  
│   ├── services/          # API connections
│   └── styles/            # CSS styling
├── routes/                # Backend API routes
├── scripts/               # Database setup scripts
├── server.js              # Main server file
└── package.json           # Project dependencies
```

## 🔧 Common Issues & Solutions

**Problem: "npm install" fails**
- Solution: Use `npm install --legacy-peer-deps`

**Problem: MongoDB connection error**
- Solution: Make sure MongoDB is running or check your Atlas connection string

**Problem: Images not uploading**
- Solution: Double-check your Cloudinary credentials in the `.env` file

**Problem: Port already in use**
- Solution: Change the PORT in your `.env` file to a different number

## 🎯 Available Scripts

- `npm start` - Run both frontend and backend
- `npm run dev` - Run frontend only
- `npm run server` - Run backend only  
- `npm run build` - Build for production
- `npm run init:db` - Set up database with sample data

## 🤝 Need Help?

1. **Check the guides**: Look at `PROJECT_STATUS.md` for detailed setup info
2. **Open an issue**: Create a GitHub issue if you find bugs
3. **Check the console**: Look at browser/terminal errors for clues

## 📝 License

This project is open source and available under the MIT License.

---

**Made with ❤️ for educational institutions**

*Ready to manage your college events like a pro? Get started now!* 🚀