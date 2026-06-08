import { Link } from 'react-router-dom';
import { images } from '../../data/images';
import { agencyInfo } from '../../data/agencyInfo';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

export default function Hero() {
  const { t } = useLanguage();
  const publicUrl = process.env.PUBLIC_URL || '';
  const heroBgUrl = `${publicUrl}${images.hero}`;
  const heroStyle = {
    '--hero-bg-image': `url("${heroBgUrl}")`,
  };

  return (
    <section className="hero" style={heroStyle}>
      <div className="hero__overlay" aria-hidden="true" />
      <div className="container hero__content animate-fade-up">
        <span className="hero__badge">
          {t('hero.badgePrefix')} {agencyInfo.foundedYear}
        </span>
        <h1 className="hero__title">
          {t('hero.titleBefore')} <span>{t('hero.titleHighlight')}</span>
        </h1>
        <p className="hero__subtitle">{t('hero.subtitle')}</p>
        <div className="hero__actions">
          <Link to="/destinations" className="btn btn--primary btn--lg">
            {t('hero.ctaDestinations')}
          </Link>
          <Link to="/contact" className="btn btn--ghost btn--lg hero__btn-light">
            {t('hero.ctaContact')}
          </Link>
        </div>
        <div className="hero__stats">
          <div><strong>9+</strong><span>{t('hero.statDest')}</span></div>
          <div><strong>15k+</strong><span>{t('hero.statTravelers')}</span></div>
          <div><strong>4.9</strong><span>{t('hero.statRating')}</span></div>
        </div>
      </div>
    </section>
  );
}
