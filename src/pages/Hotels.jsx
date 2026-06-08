import { useEffect, useState } from 'react';
import HotelCard from '../components/hotels/HotelCard';
import PageHeader from '../components/ui/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import { fetchHotelsCatalog } from '../services/hotelCatalog';

export default function Hotels() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchHotelsCatalog()
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

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow={t('pages.hotels.eyebrow')}
          title={t('pages.hotels.title')}
          subtitle={t('pages.hotels.subtitle')}
        />
        {loading ? (
          <p className="section__loading">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="section__empty">{t('pages.hotels.empty')}</p>
        ) : (
          <div className="section__grid">
            {items.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
