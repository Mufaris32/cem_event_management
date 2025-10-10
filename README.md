# 🎓 College Event Management System

A comprehensive, responsive web application for managing and displaying college events with Firebase backend integration and classical, elegant design.

## ✨ Features Overview

### 🎨 Classical Design System
- **Timeless Typography**: Elegant serif fonts for headings, clean sans-serif for body text
- **Classical Color Palette**: Deep greens, warm golds, and cream tones
- **Refined UI Elements**: Subtle shadows, elegant borders, and smooth transitions
- **Premium Feel**: Sophisticated hover effects and animations

### 🔥 Firebase Integration
- **Real-time Database**: Firestore for event storage and synchronization
- **Image Storage**: Firebase Storage for event images with compression
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Optimized Queries**: Efficient data fetching with caching

### 📱 Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Touch-Friendly**: Large touch targets and intuitive navigation
- **Fast Loading**: Optimized images and lazy loading
- **Cross-Browser**: Compatible with all modern browsers

## 🏛️ Design Philosophy

### Classical Elements
- **Serif Typography**: Elegant headings with Georgia and Times New Roman fallbacks
- **Sophisticated Colors**: 
  - Deep Forest Green (`#1B4D3E`) for primary elements
  - Warm Gold (`#FFD700`) for accents and highlights
  - Soft Cream (`#E8F3E9`) for backgrounds
  - Rich Text (`#333333`) for readability

### Modern Interactions
- **Smooth Animations**: Framer Motion for fluid transitions
- **Hover Effects**: Subtle transforms and color changes
- **Loading States**: Elegant spinners and skeleton screens
- **Micro-interactions**: Delightful button and card animations

## 🚀 Key Features

### Event Management
- ✅ **Admin Dashboard**: Comprehensive event management interface
- ✅ **Image Upload**: Firebase Storage integration with validation
- ✅ **Form Validation**: Real-time validation with helpful error messages
- ✅ **Bulk Operations**: Efficient management of multiple events
- ✅ **Statistics**: Event analytics and metrics

### Event Display
- ✅ **Gallery View**: Elegant grid layout with filtering
- ✅ **Calendar Integration**: FullCalendar with custom styling
- ✅ **Detailed Views**: Rich event pages with full information
- ✅ **Search & Filter**: Advanced search with multiple criteria
- ✅ **Quick View Modals**: Fast event previews without navigation

### User Experience
- ✅ **Loading Animations**: Beautiful loading states throughout
- ✅ **Error Handling**: Graceful error messages and retry options
- ✅ **Progressive Enhancement**: Works without JavaScript for basic functionality
- ✅ **Accessibility**: ARIA labels and keyboard navigation
- ✅ **SEO Optimized**: Proper meta tags and semantic HTML

## �️ Technology Stack

### Frontend
- **React 18** - Latest React with Concurrent Features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Router v6** - Declarative routing

### Backend & Storage
- **Firebase Firestore** - NoSQL document database
- **Firebase Storage** - File storage with CDN
- **Firebase Auth** - Authentication (optional)

### UI Libraries
- **Lucide React** - Beautiful, customizable icons
- **FullCalendar** - Feature-rich calendar component
- **React Photo View** - Lightbox for image viewing

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AdminEventForm.jsx    # Event creation/editing form
│   ├── EventCard.jsx         # Event display card
│   ├── EventModal.jsx        # Quick view modal
│   ├── LoadingSpinner.jsx    # Loading animation
│   ├── Navbar.jsx            # Navigation component
│   ├── SearchBar.jsx         # Search functionality
│   └── ProtectedRoute.jsx    # Route protection
├── firebase/            # Firebase configuration
│   ├── config.js            # Firebase setup
│   └── eventService.js      # Event CRUD operations
├── pages/               # Main application pages
│   ├── AdminDashboard.jsx   # Admin interface
│   ├── AdminLoginPage.jsx   # Admin authentication
│   ├── CalendarPage.jsx     # Calendar view
│   ├── EventDetailsPage.jsx # Individual event details
│   ├── GalleryPage.jsx      # Event gallery
│   ├── LandingPage.jsx      # Homepage
│   └── NotFound.jsx         # 404 page
├── styles/              # Global styles
│   └── globals.css          # Design system
├── utils/               # Utility functions
│   ├── auth.js              # Authentication helpers
│   ├── api.js               # API utilities
│   └── dummyData.js         # Sample data
└── images/              # Static assets
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase project (see FIREBASE_SETUP.md)

### Quick Start
1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd cem_event_management-
   npm install
   ```

2. **Configure Firebase**
   - Follow instructions in `FIREBASE_SETUP.md`
   - Update `src/firebase/config.js` with your Firebase config

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Build for Production**
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

## 🔄 Firebase Operations

### Creating Events
```javascript
import { createEvent } from './firebase/eventService';

const newEvent = await createEvent(eventData, imageFile);
```

### Fetching Events
```javascript
import { getAllEvents, getUpcomingEvents } from './firebase/eventService';

const events = await getAllEvents();
const upcoming = await getUpcomingEvents();
```

### Updating Events
```javascript
import { updateEvent } from './firebase/eventService';

const updated = await updateEvent(eventId, eventData, newImageFile);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Tailwind CSS for the design system
- Framer Motion for animations
- Lucide for beautiful icons
- The React community for excellent libraries

---

## 🆘 Need Help?

- Check `FIREBASE_SETUP.md` for Firebase configuration
- Review the code comments for implementation details
- Open an issue for bugs or feature requests
- Check the browser console for debugging information

**Built with ❤️ for educational institutions**
#
