import { Link } from 'react-router-dom';
import { images } from '../../data/images';
import { agencyInfo } from '../../data/agencyInfo';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand-col">
          <img src={images.logoWhite} alt="Mai Tourism" className="footer__logo" />
          <p className="footer__text">
            {t('footer.tagline')} {agencyInfo.foundedYear}.
          </p>
          <p className="footer__text footer__text--small">{t('footer.bankGroup')}</p>
        </div>
        <div className="footer__col footer__col--accent">
          <h4>{t('footer.explore')}</h4>
          <ul className="footer__links">
            <li><Link to="/destinations">{t('footer.destinations')}</Link></li>
            <li><Link to="/packages">{t('footer.packages')}</Link></li>
            <li><Link to="/hotels">{t('footer.hotels')}</Link></li>
            <li><Link to="/reservation">{t('footer.book')}</Link></li>
          </ul>
        </div>
        <div className="footer__col footer__col--accent">
          <h4>{t('footer.agency')}</h4>
          <ul className="footer__links">
            <li><Link to="/about">{t('footer.about')}</Link></li>
            <li><Link to="/contact">{t('footer.contact')}</Link></li>
          </ul>
        </div>
        <div className="footer__col footer__col--accent">
          <h4>{t('footer.contact')}</h4>
          <p className="footer__text">
            <a href={agencyInfo.email.href}>{agencyInfo.email.main}</a>
          </p>
          <p className="footer__text">
            <a href={agencyInfo.phone.href}>{agencyInfo.phone.agency}</a>
          </p>
          <p className="footer__text">{agencyInfo.address.full}</p>
        </div>
      </div>
      <div className="footer__bottom container">
        <p>
          &copy; {new Date().getFullYear()} {agencyInfo.name}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
