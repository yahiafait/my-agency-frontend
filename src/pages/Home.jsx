import Hero from '../components/home/Hero';
import OfferingsSection from '../components/home/OfferingsSection';
import WhyUsSection from '../components/home/WhyUsSection';
import DestinationsSection from '../components/home/DestinationsSection';
import PackagesSection from '../components/home/PackagesSection';
import HotelsSection from '../components/home/HotelsSection';
import GallerySection from '../components/home/GallerySection';
import TestimonialsSection from '../components/home/TestimonialsSection';

export default function Home() {
  return (
    <>
      <Hero />
      <OfferingsSection />
      <WhyUsSection />
      <DestinationsSection />
      <PackagesSection />
      <HotelsSection />
      <GallerySection />
      <TestimonialsSection />
    </>
  );
}
