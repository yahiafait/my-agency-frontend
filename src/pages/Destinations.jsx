import { useEffect, useState } from 'react';
import DestinationCard from '../components/destinations/DestinationCard';
import PageHeader from '../components/ui/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import { fetchDestinationsCatalog } from '../services/destinationCatalog';

export default function Destinations() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchDestinationsCatalog()
      .then((data) => {
        if (!cancelled) setItems(data.filter((d) => d.imageUrl));
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
          eyebrow={t('pages.destinations.eyebrow')}
          title={t('pages.destinations.title')}
          subtitle={t('pages.destinations.subtitle')}
        />
        {loading ? (
          <p className="section__loading">{t('common.loading')}</p>
        ) : (
          <div className="section__grid">
            {items.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
