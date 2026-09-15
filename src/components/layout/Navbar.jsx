import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { images } from '../../data/images';
import { useLanguage } from '../../context/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [travelOpen, setTravelOpen] = useState(false);
  const travelRef = useRef(null);
  const location = useLocation();

  const travelPaths = ['/destinations', '/packages', '/hotels'];
  const travelActive = travelPaths.some((p) =>
    location.pathname === p || location.pathname.startsWith(`${p}/`)
  );

  useEffect(() => {
    setTravelOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onDoc = (e) => {
      if (travelRef.current && !travelRef.current.contains(e.target)) {
        setTravelOpen(false);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo-wrap">
            <img src={images.logoColor} alt="MAI Tourisme" className="navbar__logo-img" />
          </span>
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={t('nav.menu')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </button>

        <nav className={`navbar__nav${menuOpen ? ' navbar__nav--open' : ''}`}>
          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            {t('nav.home')}
          </NavLink>

          <div
            className={`navbar__dropdown${travelActive ? ' navbar__dropdown--active' : ''}${travelOpen ? ' navbar__dropdown--open' : ''}`}
            ref={travelRef}
          >
            <button
              type="button"
              className={`navbar__dropdown-trigger${travelActive ? ' navbar__link--active' : ''}`}
              aria-expanded={travelOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setTravelOpen((o) => !o);
              }}
            >
              {t('nav.travel')}
              <span className="navbar__dropdown-chevron" aria-hidden />
            </button>
            <div className="navbar__dropdown-panel" role="menu">
              <NavLink
                to="/destinations"
                role="menuitem"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.destinations')}
              </NavLink>
              <NavLink
                to="/packages"
                role="menuitem"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.packages')}
              </NavLink>
              <NavLink
                to="/hotels"
                role="menuitem"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.hotels')}
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            {t('nav.about')}
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            {t('nav.contact')}
          </NavLink>

          <div className="navbar__lang" role="group" aria-label="Language">
            <button
              type="button"
              className={`navbar__lang-btn${locale === 'fr' ? ' navbar__lang-btn--active' : ''}`}
              onClick={() => setLocale('fr')}
            >
              {t('nav.langFr')}
            </button>
            <button
              type="button"
              className={`navbar__lang-btn${locale === 'en' ? ' navbar__lang-btn--active' : ''}`}
              onClick={() => setLocale('en')}
            >
              {t('nav.langEn')}
            </button>
          </div>

          <Link
            to="/reservation"
            className="btn btn--accent navbar__cta"
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.reserve')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
