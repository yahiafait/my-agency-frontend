import { Link } from 'react-router-dom';
import { images } from '../data/images';
import { agencyInfo } from '../data/agencyInfo';
import { translations } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { AboutServiceIcon } from '../components/icons/AboutServiceIcons';
import './About.css';

export default function About() {
  const { locale, t } = useLanguage();
  const about = translations[locale].about;
  const yearsExperience = new Date().getFullYear() - agencyInfo.foundedYear;

  const pillars = [
    { title: about.atouts[0], desc: about.values[0]?.text },
    { title: about.atouts[1], desc: about.values[1]?.text },
    { title: about.atouts[2], desc: about.values[2]?.text },
  ].filter((p) => p.title);

  return (
    <div className="page about">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero__mesh" aria-hidden />
        <div className="container about-hero__inner">
          <div className="about-hero__grid">
            <div className="about-hero__copy animate-fade-up">
              <p className="about-hero__eyebrow">{t('footer.bankGroup')}</p>
              <h1 id="about-hero-title" className="about-hero__title">
                {t('about.pageTitle')}
              </h1>
              <p className="about-hero__lead">{t('about.pageBody')}</p>
              <div className="about-hero__chips">
                {about.atouts.slice(0, 4).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <figure className="about-hero__media animate-fade-up">
              <div className="about-hero__frame">
                <img src={images.aboutAgency} alt={about.agencyImgAlt} className="about-hero__photo" />
              </div>
              <figcaption className="about-hero__badge">
                {t('about.sinceYear', { year: agencyInfo.foundedYear })}
              </figcaption>
            </figure>
          </div>

          <div className="about-hero__stats">
            <article className="about-stat about-stat--1">
              <span className="about-stat__value">{yearsExperience}+</span>
              <span className="about-stat__label">{about.statsExpertise}</span>
            </article>
            <article className="about-stat about-stat--2">
              <span className="about-stat__value">{about.services.length}</span>
              <span className="about-stat__label">{about.servicesTitle}</span>
            </article>
            <article className="about-stat about-stat--3">
              <span className="about-stat__value">{agencyInfo.team.length}</span>
              <span className="about-stat__label">{about.teamTitle}</span>
            </article>
            <article className="about-stat about-stat--4">
              <span className="about-stat__value">{agencyInfo.foundedYear}</span>
              <span className="about-stat__label">{about.statFoundedLabel}</span>
            </article>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container about-story__inner">
          <div className="about-story__quote animate-fade-up">
            <span className="about-story__mark" aria-hidden>
              “
            </span>
            <p className="about-story__text">{about.presentation}</p>
            <p className="about-story__sub">
              {t('about.introP2', { founded: agencyInfo.foundedYear, exp: yearsExperience })}
            </p>
          </div>
        </div>
      </section>

      {pillars.length > 0 && (
        <section className="about-pillars" aria-labelledby="about-pillars-title">
          <div className="container">
            <header className="about-section-head about-section-head--light animate-fade-up">
              <span className="about-section-head__kicker">{about.sectionWhy}</span>
              <h2 id="about-pillars-title">{about.atoutsTitle}</h2>
            </header>
            <div className="about-pillars__grid">
              {pillars.map((pillar, i) => (
                <article
                  key={pillar.title}
                  className="about-pillar animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span className="about-pillar__num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="about-mv">
        <div className="container about-mv__grid">
          <article className="about-mv__card about-mv__card--mission animate-fade-up">
            <div className="about-mv__icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
              </svg>
            </div>
            <h2>{about.missionTitle}</h2>
            <p>{about.mission}</p>
          </article>
          <article className="about-mv__card about-mv__card--vision animate-fade-up">
            <div className="about-mv__icon about-mv__icon--accent" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </div>
            <h2>{about.visionTitle}</h2>
            <p>{about.vision}</p>
          </article>
        </div>
      </section>

      <section className="about-services" aria-labelledby="about-svc-title">
        <div className="container">
          <header className="about-section-head animate-fade-up">
            <span className="about-section-head__kicker">{about.sectionServices}</span>
            <h2 id="about-svc-title">{about.servicesTitle}</h2>
            <p>{about.bizLine}</p>
          </header>
          <ul className="about-services__grid">
            {about.services.map((service, i) => (
              <li
                key={service}
                className="about-service-card animate-fade-up"
                style={{ animationDelay: `${(i % 5) * 0.05}s` }}
              >
                <span className="about-service-card__icon">
                  <AboutServiceIcon index={i} className="about-service-card__svg" />
                </span>
                <span className="about-service-card__text">{service}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-values" aria-labelledby="about-val-title">
        <div className="container">
          <header className="about-section-head about-section-head--center animate-fade-up">
            <span className="about-section-head__kicker">{about.sectionValues}</span>
            <h2 id="about-val-title">{about.valuesTitle}</h2>
          </header>
          <div className="about-values__grid">
            {about.values.map((v, i) => (
              <article
                key={v.title}
                className="about-value-card animate-fade-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <span className="about-value-card__badge" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-team" aria-labelledby="about-team-title">
        <div className="container">
          <header className="about-section-head animate-fade-up">
            <span className="about-section-head__kicker">{about.sectionTeam}</span>
            <h2 id="about-team-title">{about.teamTitle}</h2>
          </header>
          <div className="about-team__grid">
            {agencyInfo.team.map((member, i) => (
              <article
                key={member.email}
                className="about-team-card animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="about-team-card__top">
                  <span className="about-team-card__avatar" aria-hidden>
                    {member.name
                      .split(' ')
                      .map((p) => p[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <div>
                    <h3>{member.name}</h3>
                    <p className="about-team-card__role">{about.teamRoles[i]}</p>
                  </div>
                </div>
                <div className="about-team-card__contacts">
                  <a href={`tel:${member.phone.replace(/\s/g, '')}`}>{member.phone}</a>
                  <a href={`mailto:${member.email}`}>{member.email}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta" aria-labelledby="about-cta-title">
        <div className="container about-cta__box">
          <div className="about-cta__pattern" aria-hidden />
          <div className="about-cta__content">
            <h2 id="about-cta-title">{about.ctaTitle}</h2>
            <p className="about-cta__sub">{agencyInfo.address.full}</p>
            <div className="about-cta__actions">
              <Link to="/contact" className="btn btn--accent btn--lg about-cta__btn">
                {about.ctaButton}
              </Link>
              <Link to="/reservation" className="btn about-cta__btn-secondary">
                {t('nav.reserve')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
