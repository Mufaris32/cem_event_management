# 🎓 College Event Management System

A modern, responsive web application designed for Jaffna College of Education to manage and showcase college events with an elegant, user-friendly interface.

## 📋 Table of Contents
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Admin Features](#-admin-features)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality
- **Event Management**: Create, edit, delete, and organize college events
- **Photo Gallery**: Upload and manage event photos with Cloudinary integration
- **Calendar View**: Interactive calendar displaying all events with filtering
- **Admin Dashboard**: Comprehensive admin panel with statistics and management tools
- **Responsive Design**: Mobile-first design that works seamlessly on all devices
- **Search & Filter**: Advanced search capabilities with category and date filtering

### 🔧 Technical Features
- **Real-time Updates**: Live data synchronization across all components
- **Image Optimization**: Automatic image compression and resizing via Cloudinary
- **Form Validation**: Comprehensive client-side and server-side validation
- **Admin Authentication**: Secure admin login with session management
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Smooth loading animations and skeleton screens

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Framer Motion** - Smooth animations and page transitions
- **React Router v6** - Declarative client-side routing

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Minimal and flexible web application framework
- **MongoDB** - NoSQL document database
- **Cloudinary** - Cloud-based image storage and optimization

### Additional Libraries
- **Lucide React** - Beautiful and customizable icon library
- **FullCalendar** - Interactive calendar component with event management
- **GSAP** - Professional-grade animation library
- **Mongoose** - MongoDB object modeling for Node.js

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for image management

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mufaris32/cem_event_management.git
   cd cem_event_management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

4. **Initialize Database**
   ```bash
   node scripts/init-database.js
   ```

5. **Start Development Server**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 5173
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
cem_event_management/
├── 📁 src/                     # Frontend source code
│   ├── 📁 components/          # Reusable React components
│   │   ├── AdminEventForm.jsx  # Event creation/editing form
│   │   ├── EventCard.jsx       # Event display card
│   │   ├── Gallery.jsx         # Photo gallery component
│   │   ├── LoadingSpinner.jsx  # Loading animation
│   │   └── Navbar.jsx          # Navigation component
│   ├── 📁 pages/               # Main application pages
│   │   ├── AdminDashboard.jsx  # Admin management interface
│   │   ├── CalendarPage.jsx    # Interactive calendar view
│   │   ├── EventsPage.jsx      # Events listing page
│   │   ├── GalleryPage.jsx     # Photo gallery page
│   │   └── LandingPage.jsx     # Homepage
│   ├── 📁 services/            # API service functions
│   ├── 📁 styles/              # Global CSS styles
│   └── 📁 utils/               # Utility functions
├── 📁 routes/                  # Backend API routes
├── 📁 models/                  # Database models
├── 📁 config/                  # Configuration files
├── server.js                   # Express server entry point
├── vite.config.mjs            # Vite configuration
└── package.json               # Project dependencies
```

## 👨‍💼 Admin Features

### Dashboard Overview
- **Event Statistics**: Total, upcoming, and past events count
- **Quick Actions**: Add new event, manage carousel
- **Recent Events**: List of recently created events with management options

### Event Management
- **Create Events**: Rich form with image upload and validation
- **Edit Events**: Inline editing with real-time updates
- **Delete Events**: Confirmation dialog for safe deletion
- **Bulk Operations**: Manage multiple events efficiently

### Gallery Management
- **Photo Upload**: Drag-and-drop image upload for past events
- **Image Organization**: Organize photos by event categories
- **Photo Editing**: Basic editing tools and caption management

### Authentication
- **Secure Login**: Admin authentication with session management
- **Protected Routes**: Access control for admin-only features
- **Auto Logout**: Session timeout for security

## 🔌 API Endpoints

### Events
```http
GET    /api/events              # Get all events
GET    /api/events/upcoming     # Get upcoming events
GET    /api/events/past         # Get past events
GET    /api/events/:id          # Get specific event
POST   /api/events              # Create new event
PUT    /api/events/:id          # Update event
DELETE /api/events/:id          # Delete event
```

### Gallery
```http
GET    /api/gallery/:eventId    # Get event photos
POST   /api/gallery/:eventId    # Upload photos
DELETE /api/gallery/:photoId    # Delete photo
```

### Carousel
```http
GET    /api/carousel             # Get carousel items
POST   /api/carousel             # Create carousel item
PUT    /api/carousel/:id         # Update carousel item
DELETE /api/carousel/:id         # Delete carousel item
```

## 📱 Screenshots

### Homepage
Beautiful landing page with hero carousel and feature highlights.

### Calendar View  
Interactive calendar with event filtering and category-based color coding.

### Admin Dashboard
Comprehensive admin interface with statistics and management tools.

### Event Gallery
Elegant photo gallery with lightbox functionality and mobile optimization.

## 🎨 Design System

### Color Palette
- **Primary Green**: `#1E8449` - Main brand color
- **Secondary Yellow**: `#F1C40F` - Accent color  
- **Neutral Grays**: Various shades for text and backgrounds
- **Semantic Colors**: Success, warning, and error states

### Typography
- **Headings**: Serif fonts for elegance
- **Body Text**: Sans-serif for readability
- **Responsive**: Fluid typography scaling

## 🔧 Configuration

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/cem_events

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=development
```

### Admin Credentials
Default admin login (change in production):
- **Username**: `admin`
- **Password**: `admin123`

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```bash
docker build -t cem-events .
docker run -p 5000:5000 cem-events
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling consistency
- Write descriptive commit messages
- Test features thoroughly before submitting PR
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Jaffna College of Education** - For providing the requirements and feedback
- **React Community** - For excellent libraries and documentation
- **Tailwind CSS** - For the amazing utility-first CSS framework
- **Cloudinary** - For reliable image storage and optimization
- **MongoDB** - For flexible document database

## 📞 Support

For support or questions:
- **Email**: support@jaffnacollege.edu
- **Issues**: [GitHub Issues](https://github.com/Mufaris32/cem_event_management/issues)
- **Documentation**: Check the code comments and this README

---

**Built with ❤️ for Jaffna College of Education**

*Last updated: September 2025*