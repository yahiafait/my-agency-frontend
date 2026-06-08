import { IconMenu } from '../icons/AdminIcons';
import './Topbar.css';

/** Barre supérieure du dashboard (titre + menu mobile). */
export default function Topbar({ title, subtitle, onMenuClick }) {
  return (
    <header className="admin-topbar">
      <button
        type="button"
        className="admin-topbar__menu"
        aria-label="Ouvrir le menu"
        onClick={onMenuClick}
      >
        <IconMenu />
      </button>
      <div>
        <h1 className="admin-topbar__title">{title}</h1>
        {subtitle && <p className="admin-topbar__sub">{subtitle}</p>}
      </div>
    </header>
  );
}
