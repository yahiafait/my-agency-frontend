import { Link } from 'react-router-dom';
import { translations } from '../../i18n/translations';
import { agencyInfo } from '../../data/agencyInfo';
import { useLanguage } from '../../context/LanguageContext';
import SectionHeader from '../ui/SectionHeader';
import './WhyUsSection.css';

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
      <path
        d="M8 12.5l2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WhyUsSection() {
  const { locale, t } = useLanguage();
  const atouts = translations[locale].about.atouts;
  const yearsExperience = new Date().getFullYear() - agencyInfo.foundedYear;

  return (
    <section className="section why-us" aria-labelledby="why-us-title">
      <div className="container">
        <SectionHeader
          titleId="why-us-title"
          eyebrow={t('whyUs.eyebrow')}
          title={t('whyUs.title')}
          subtitle={t('whyUs.subtitle')}
        />

        <div className="why-us__layout">
          <aside className="why-us__highlight animate-fade-up">
            <p className="why-us__highlight-value">{yearsExperience}+</p>
            <p className="why-us__highlight-label">{t('whyUs.yearsLabel')}</p>
            <p className="why-us__highlight-meta">
              {t('whyUs.since', { year: agencyInfo.foundedYear })}
            </p>
            <p className="why-us__highlight-group">{t('footer.bankGroup')}</p>
            <Link to="/about" className="btn btn--primary why-us__cta">
              {t('whyUs.cta')}
            </Link>
          </aside>

          <ul className="why-us__grid">
            {atouts.map((item, index) => (
              <li key={item} className="why-us__card animate-fade-up">
                <span className="why-us__card-icon">
                  <IconCheck />
                </span>
                <span className="why-us__card-num" aria-hidden>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="why-us__card-text">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
