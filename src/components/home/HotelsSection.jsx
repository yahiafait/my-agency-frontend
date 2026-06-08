import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../hotels/HotelCard';
import SectionHeader from '../ui/SectionHeader';
import { useLanguage } from '../../context/LanguageContext';
import { fetchHotelsCatalog } from '../../services/hotelCatalog';

export default function HotelsSection() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchHotelsCatalog({ featured: true })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow={t('sectionHotels.eyebrow')}
          title={t('sectionHotels.title')}
          subtitle={t('sectionHotels.subtitle')}
        />
        {loading ? (
          <p className="section__loading">{t('common.loading')}</p>
        ) : (
          <div className="section__grid">
            {items.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        )}
        <div className="section__cta">
          <Link to="/hotels" className="btn btn--primary">
            {t('sectionHotels.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
