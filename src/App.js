import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { LanguageProvider } from './context/LanguageContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute';
import ProtectedAdminOnlyRoute from './components/auth/ProtectedAdminOnlyRoute';
import AdminLayout from './admin/layouts/AdminLayout';
import DashboardMessages from './admin/pages/DashboardMessages';
import DashboardManagers from './admin/pages/DashboardManagers';
import DashboardDestinations from './admin/pages/DashboardDestinations';
import DashboardHotels from './admin/pages/DashboardHotels';
import DashboardPackages from './admin/pages/DashboardPackages';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Packages from './pages/Packages';
import Hotels from './pages/Hotels';
import About from './pages/About';
import Contact from './pages/Contact';
import Reservation from './pages/Reservation';
import AdminLogin from './pages/admin/AdminLogin';
import './App.css';

function App() {
  return (
    <AdminAuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="admin/login" element={<AdminLogin />} />
            <Route
              path="admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Navigate to="messages" replace />} />
              <Route path="messages" element={<DashboardMessages />} />
              <Route
                path="managers"
                element={
                  <ProtectedAdminOnlyRoute>
                    <DashboardManagers />
                  </ProtectedAdminOnlyRoute>
                }
              />
              <Route path="destinations" element={<DashboardDestinations />} />
              <Route path="hotels" element={<DashboardHotels />} />
              <Route path="packages" element={<DashboardPackages />} />
            </Route>

            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="destinations" element={<Destinations />} />
              <Route path="destinations/:id" element={<DestinationDetail />} />
              <Route path="packages" element={<Packages />} />
              <Route path="hotels" element={<Hotels />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="reservation" element={<Reservation />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AdminAuthProvider>
  );
}

export default App;
