import Hero from '@/components/layout/Hero';
import CustomerTestimonialsMasonry from '@/components/layout/Testimonials';
import { homeContent } from '@/constants';
import WhyUse from '@/components/layout/WhyUse';

export default function Home() {
  const { hero, features, whyUse, testimonials } = homeContent;
  return (
    <section className='relative'>
      <Hero hero={hero} features={features} />
      <WhyUse whyUse={whyUse} />
      <CustomerTestimonialsMasonry testimonials={testimonials} />
    </section>
  );
}
