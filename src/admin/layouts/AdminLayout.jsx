import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../icons/AdminIcons.css';
import './AdminLayout.css';

const PAGE_META = {
  messages: {
    title: 'Boîte de réception',
    subtitle: 'Messages contact et réservations du site',
  },
  managers: {
    title: 'Managers',
    subtitle: 'Deux comptes maximum — accès messages & réservations',
  },
  destinations: {
    title: 'Destinations',
    subtitle: 'Catalogue du site — ajout et mise à jour par admin et managers',
  },
  hotels: {
    title: 'Hôtels',
    subtitle: 'Catalogue hôtels partenaires — gestion par admin et managers',
  },
  packages: {
    title: 'Forfaits',
    subtitle: 'Créez des offres combinées destination + hôtels',
  },
};

/**
 * Layout SaaS admin : sidebar + zone principale (Outlet).
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const segment = location.pathname.split('/').pop() || 'messages';
  const meta = PAGE_META[segment] || PAGE_META.messages;

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className={`admin-shell${sidebarOpen ? ' admin-shell--nav-open' : ''}`}>
      <div
        className="admin-shell__backdrop"
        aria-hidden={!sidebarOpen}
        onClick={() => setSidebarOpen(false)}
      />
      <div className="admin-shell__sidebar">
        <Sidebar onMobileClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </div>
      <div className="admin-shell__main">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen((o) => !o)}
        />
        <div className="admin-shell__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
