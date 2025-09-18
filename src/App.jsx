import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import GalleryPage from './pages/GalleryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCarouselPage from './pages/AdminCarouselPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import APIDebugPanel from './components/APIDebugPanel';
import NotFound from './pages/NotFound';

// Component to handle route changes and cleanup
function RouteChangeHandler() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change - immediate scroll for better UX
    window.scrollTo(0, 0);

    // Clean up any remaining tooltips on route change
    const tooltips = document.querySelectorAll('.fc-tooltip');
    tooltips.forEach(tooltip => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    });
  }, [location.pathname]); // Only trigger on pathname change

  return null;
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <RouteChangeHandler />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/carousel" element={
          <ProtectedRoute>
            <AdminCarouselPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ScrollToTopButton />
      <APIDebugPanel />
    </Router>
  );
}

export default App;
