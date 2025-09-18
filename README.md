# 🎓 College Event Management System

A modern, user-friendly web application for viewing and managing college events. Perfect for students, faculty, and administrators who want to stay updated on campus activities.

## ✨ What This App Does

- **View Events**: Browse upcoming and past college events in a beautiful gallery
- **Calendar View**: See all events organized by date in an interactive calendar
- **Event Details**: Get complete information about each event including photos, location, and organizer details  
- **Admin Panel**: College staff can easily add, edit, and manage events
- **Mobile Friendly**: Works perfectly on phones, tablets, and computers

## 🚀 Getting Started

### For Users
1. Visit the website homepage to see all events
2. Use the calendar to view events by date
3. Click on any event to see full details
4. Browse the photo gallery to see past events

### For Administrators
1. Go to `/admin/login` 
2. Sign in with your admin credentials
3. Add, edit, or delete events from the dashboard
4. Upload photos and manage event information

## 🛠️ Quick Setup (For Developers)

### What You Need
- Node.js (version 16 or higher)
- MongoDB database
- Cloudinary account (for image storage)

### Installation Steps
1. **Get the code**
   ```bash
   git clone <repository-url>
   cd cem_event_management
   npm install --legacy-peer-deps
   ```

2. **Set up your environment**
   - Copy `.env.example` to `.env`
   - Add your MongoDB and Cloudinary credentials
   - Update admin login credentials if needed

3. **Start the application**
   ```bash
   # Start both frontend and backend
   npm start
   
   # Or run them separately:
   npm run server:dev  # Backend only
   npm run dev         # Frontend only
   ```

4. **Add sample data (optional)**
   ```bash
   npm run init:db
   ```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
- **API**: http://localhost:5000

## 🎯 Key Features

### For Students & Faculty
- **Event Discovery**: Easily find upcoming events, workshops, and activities
- **Event Details**: Complete information including time, location, and contact details
- **Visual Gallery**: Browse photos from past events
- **Calendar Integration**: See all events organized by date
- **Mobile Optimized**: Perfect viewing experience on any device

### for Administrators  
- **Easy Event Management**: Simple forms to add and edit events
- **Image Upload**: Upload multiple photos for each event
- **Event Analytics**: See statistics about your events
- **User-Friendly Interface**: No technical knowledge required

## 🏗️ Technology Used

- **Frontend**: React + Vite (modern web technologies)
- **Backend**: Node.js + Express (server technology)
- **Database**: MongoDB (data storage)
- **Images**: Cloudinary (photo storage and optimization)
- **Styling**: Tailwind CSS (beautiful, responsive design)

## 📱 How to Use

### Viewing Events
1. **Homepage**: See featured and upcoming events
2. **Gallery Page**: Browse all events with filtering options
3. **Calendar Page**: View events organized by date
4. **Event Details**: Click any event for complete information

### Managing Events (Admin)
1. **Login**: Use the admin login page
2. **Dashboard**: View all events and statistics
3. **Add Event**: Fill out the simple form with event details
4. **Edit/Delete**: Manage existing events easily

## 🔧 Configuration

### Admin Access
Default admin credentials (change these!):
- **Username**: admin  
- **Password**: 123admin@

To change admin credentials, edit `src/utils/auth.js` or use environment variables.

### Environment Variables
Create a `.env` file with:
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=5000
```

## 🆘 Need Help?

### Common Issues
- **Can't connect to database**: Check your MongoDB connection string
- **Images not uploading**: Verify your Cloudinary credentials
- **Admin login not working**: Check your credentials in the auth file

### Getting Support
- Check the `PROJECT_STATUS.md` file for current status
- Look at `MIGRATION_GUIDE.md` for technical details
- Open an issue on GitHub for bugs or questions

## 📄 Additional Documentation

- `PROJECT_STATUS.md` - Current project status and recent changes
- `MIGRATION_GUIDE.md` - Technical migration details
- `ADMIN_PASSWORD_GUIDE.md` - How to change admin passwords

---

**Built with ❤️ for educational institutions**

*This is a complete event management solution designed to be simple for users and powerful for administrators.*