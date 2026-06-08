import { useLanguage } from '../../context/LanguageContext';
import './HotelCard.css';

export default function HotelCard({ hotel }) {
  const { t, priceLocale } = useLanguage();

  return (
    <article className="hotel-card">
      <div className="hotel-card__media">
        <img src={hotel.imageUrl} alt={hotel.name} loading="lazy" />
        <span className="hotel-card__stars">{'★'.repeat(hotel.stars)}</span>
      </div>
      <div className="hotel-card__body">
        <p className="hotel-card__loc">{hotel.city}, {hotel.country}</p>
        <h3>{hotel.name}</h3>
        <p className="hotel-card__desc">{hotel.description}</p>
        <p className="hotel-card__price">
          <strong>{Number(hotel.pricePerNight).toLocaleString(priceLocale)} €</strong>
          {' '}
          {t('common.perNight')}
        </p>
      </div>
    </article>
  );
}
