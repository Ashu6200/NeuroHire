
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import { Navbar } from "@/components/layout/navbar";
import CustomerTestimonialsMasonry from "@/components/layout/Testimonials";
import { homeContent } from "@/constants";
import WhyUse from "@/components/layout/WhyUse";


export default function Home() {
  const { hero, features, whyUse, testimonials } = homeContent;
  return (
    <main className="min-h-screen relative">
      <Navbar />
      <Hero hero={hero} features={features}/>
      <WhyUse whyUse={whyUse}/>
      <CustomerTestimonialsMasonry testimonials={testimonials}/>
      <Footer />
    </main>
  );
}
