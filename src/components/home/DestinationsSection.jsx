import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DestinationCard from '../destinations/DestinationCard';
import SectionHeader from '../ui/SectionHeader';
import { useLanguage } from '../../context/LanguageContext';
import { fetchDestinationsCatalog } from '../../services/destinationCatalog';

export default function DestinationsSection() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchDestinationsCatalog({ featured: true }).then((data) => {
      if (!cancelled) setItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow={t('sectionDestinations.eyebrow')}
          title={t('sectionDestinations.title')}
          subtitle={t('sectionDestinations.subtitle')}
        />
        <div className="section__grid">
          {items.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
        <div className="section__cta">
          <Link to="/destinations" className="btn btn--primary">
            {t('sectionDestinations.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
