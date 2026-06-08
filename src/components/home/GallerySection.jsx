import { galleryImages } from '../../data/mockData';
import SectionHeader from '../ui/SectionHeader';
import { useLanguage } from '../../context/LanguageContext';
import './GallerySection.css';

export default function GallerySection() {
  const { t } = useLanguage();

  return (
    <section className="section gallery-section">
      <div className="container">
        <SectionHeader
          eyebrow={t('sectionGallery.eyebrow')}
          title={t('sectionGallery.title')}
          subtitle={t('sectionGallery.subtitle')}
        />
        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <figure key={img.id} className={`gallery-item gallery-item--${(i % 6) + 1}`}>
              <img src={img.imageUrl} alt={img.title} loading="lazy" />
              <figcaption>{img.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
