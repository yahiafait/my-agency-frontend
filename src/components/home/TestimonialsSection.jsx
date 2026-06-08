import { testimonials } from '../../data/mockData';
import SectionHeader from '../ui/SectionHeader';
import { useLanguage } from '../../context/LanguageContext';
import './TestimonialsSection.css';

export default function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHeader
          eyebrow={t('sectionTestimonials.eyebrow')}
          title={t('sectionTestimonials.title')}
          subtitle={t('sectionTestimonials.subtitle')}
        />
        <div className="testimonials__grid">
          {testimonials.map((row) => (
            <blockquote key={row.id} className="testimonial">
              <p>&ldquo;{row.content}&rdquo;</p>
              <footer>
                <img src={row.avatarUrl} alt="" />
                <div>
                  <strong>{row.clientName}</strong>
                  <span>{row.tripLabel}</span>
                  <div className="testimonial__stars">{'★'.repeat(row.rating)}</div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
