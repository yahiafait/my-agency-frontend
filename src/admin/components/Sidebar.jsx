import { NavLink } from 'react-router-dom';
import { IconInbox, IconExternal, IconLogout, IconGlobe, IconUsers } from '../icons/AdminIcons';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { images } from '../../data/images';
import './Sidebar.css';

/** Navigation latérale admin. */
export default function Sidebar({ onMobileClose, onLogout }) {
  const { isAdmin, role, displayName } = useAdminAuth();

  const linkClass = ({ isActive }) =>
    `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`;

  const close = () => onMobileClose?.();
  const badge = role === 'ADMIN' ? 'Admin' : 'Manager';

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <img src={images.logo} alt="MAI Tourisme" width={120} height={40} />
        <span className="admin-sidebar__badge">{badge}</span>
        {displayName && <span className="admin-sidebar__user">{displayName}</span>}
      </div>

      <nav className="admin-sidebar__nav" aria-label="Navigation admin">
        <p className="admin-sidebar__section">Activité</p>
        <NavLink to="/admin/messages" className={linkClass} end onClick={close}>
          <IconInbox />
          Boîte de réception
        </NavLink>
        <NavLink to="/admin/destinations" className={linkClass} onClick={close}>
          <IconGlobe />
          Destinations
        </NavLink>
        <NavLink to="/admin/hotels" className={linkClass} onClick={close}>
          <span className="admin-sidebar__icon" aria-hidden>
            🏨
          </span>
          Hôtels
        </NavLink>
        <NavLink to="/admin/packages" className={linkClass} onClick={close}>
          <span className="admin-sidebar__icon" aria-hidden>
            🧳
          </span>
          Forfaits
        </NavLink>

        {isAdmin && (
          <>
            <p className="admin-sidebar__section">Administration</p>
            <NavLink to="/admin/managers" className={linkClass} onClick={close}>
              <IconUsers />
              Managers
            </NavLink>
          </>
        )}

        <p className="admin-sidebar__section">Site</p>
        <a href="/" className="admin-sidebar__link" onClick={close}>
          <IconExternal />
          Voir le site
        </a>
      </nav>

      <div className="admin-sidebar__footer">
        <button type="button" className="admin-sidebar__logout" onClick={onLogout}>
          <IconLogout />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
