import { useLanguage } from '../../context/LanguageContext';
import './OfferingsSection.css';

function IconGlobe() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="24" cy="24" r="14" />
      <path d="M10 24h28M24 10c3 4 3 20 0 24M24 10c-3 4-3 20 0 24" />
    </svg>
  );
}

function Icon247() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="24" cy="24" r="14" />
      <path d="M24 14v10l6 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 12h6M35 9v6" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M24 8l14 6v10c0 10-6 18-14 22-8-4-14-12-14-22V14l14-6z" />
      <path d="M24 18v12M18 24h12" strokeLinecap="round" />
    </svg>
  );
}

function IconSLA() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="24" cy="26" r="12" />
      <path d="M24 20v7l5 3" strokeLinecap="round" />
      <path d="M16 10h16M20 6h8" strokeLinecap="round" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="22" cy="22" r="10" />
      <path d="M18 22l3 3 6-6M30 30l8 8" strokeLinecap="round" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="20" cy="20" r="9" />
      <path d="M27 27l11 11" strokeLinecap="round" />
      <path d="M14 24h4M22 16v4" strokeLinecap="round" />
    </svg>
  );
}

const icons = [IconGlobe, Icon247, IconShield, IconSLA, IconChart, IconSearch];

export default function OfferingsSection() {
  const { t } = useLanguage();
  const keys = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

  return (
    <section className="section offerings section--alt">
      <div className="container">
        <header className="offerings__header">
          <h2 className="offerings__title">{t('offerings.title')}</h2>
          <p className="offerings__subtitle">{t('offerings.subtitle')}</p>
        </header>
        <div className="offerings__grid">
          {keys.map((key, i) => {
            const Icon = icons[i];
            return (
              <article key={key} className="offerings__card animate-fade-up">
                <div className="offerings__icon-ring" aria-hidden>
                  <Icon />
                </div>
                <h3 className="offerings__card-title">{t(`offerings.${key}t`)}</h3>
                <p className="offerings__card-text">{t(`offerings.${key}d`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
