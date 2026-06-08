import { useState } from 'react';
import contactService from '../api/contactService';
import { agencyInfo } from '../data/agencyInfo';
import { images } from '../data/images';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      await contactService.send({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() ? form.phone.trim() : null,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setStatus({
        type: 'success',
        text: t('pages.contact.success'),
      });
      setForm(initialForm);
    } catch {
      setStatus({
        type: 'error',
        text: t('pages.contact.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page contact-page">
      <section className="contact-hero">
        <div className="container contact-hero__inner">
          <span className="contact-hero__eyebrow">{t('pages.contact.eyebrow')}</span>
          <h1>{t('pages.contact.title')}</h1>
          <p>{t('pages.contact.heroSub')}</p>
        </div>
      </section>

      <div className="container contact-page__layout">
        <aside className="contact-page__visual animate-fade-up">
          <div className="contact-page__image-wrap contact-page__image-wrap--support">
            <img
              src={images.conseillereContact}
              alt={t('pages.contact.imgAlt')}
              decoding="async"
            />
          </div>

          <div className="contact-info-cards">
            <article className="contact-info-card">
              <span className="contact-info-card__icon" aria-hidden>✉</span>
              <div>
                <strong>{t('pages.contact.labelEmail')}</strong>
                <a href={agencyInfo.email.href}>{agencyInfo.email.main}</a>
              </div>
            </article>
            <article className="contact-info-card">
              <span className="contact-info-card__icon" aria-hidden>☎</span>
              <div>
                <strong>{t('pages.contact.labelPhone')}</strong>
                <a href={agencyInfo.phone.href}>{agencyInfo.phone.agency}</a>
              </div>
            </article>
            <article className="contact-info-card">
              <span className="contact-info-card__icon" aria-hidden>📍</span>
              <div>
                <strong>{t('pages.contact.labelAddress')}</strong>
                <p>{agencyInfo.address.full}</p>
              </div>
            </article>
          </div>
        </aside>

        <form className="contact-form animate-fade-up" onSubmit={handleSubmit}>
          <h2>{t('pages.contact.formTitle')}</h2>
          {status.text && (
            <p className={`contact-form__alert contact-form__alert--${status.type}`}>
              {status.text}
            </p>
          )}

          <fieldset className="contact-form__fieldset">
            <legend>{t('pages.contact.coords')}</legend>
            <div className="contact-form__row">
              <label>
                {t('pages.reservation.firstName')}
                <input
                  name="firstName"
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder={t('pages.contact.phFirstName')}
                />
              </label>
              <label>
                {t('pages.reservation.lastName')}
                <input
                  name="lastName"
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder={t('pages.contact.phLastName')}
                />
              </label>
            </div>
            <label>
              {t('pages.reservation.email')}
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('pages.contact.phEmail')}
              />
            </label>
            <label>
              {t('pages.reservation.phone')}
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder={t('pages.contact.phPhone')}
              />
            </label>
          </fieldset>

          <fieldset className="contact-form__fieldset">
            <legend>{t('pages.contact.messageBlock')}</legend>
            <label>
              {t('pages.contact.subjectField')}
              <input
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder={t('pages.contact.phSubject')}
              />
            </label>
            <label>
              {t('pages.contact.messageField')}
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder={t('pages.contact.phMessage')}
              />
            </label>
          </fieldset>

          <button type="submit" className="btn btn--accent btn--lg" disabled={loading}>
            {loading ? t('pages.contact.sending') : t('pages.contact.send')}
          </button>
        </form>
      </div>

      <div className="container contact-page__map">
        <h2>{t('pages.contact.mapTitle')}</h2>
        <iframe
          title={t('pages.contact.mapIframeTitle')}
          src={agencyInfo.mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
