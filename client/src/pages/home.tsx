import Navigation from '@/components/navigation';
import HeroSection from '@/components/sections/hero2';
import FeaturesSection from '@/components/sections/features';
import AboutSection from '@/components/sections/about';
import TestimonialsSection from '@/components/sections/testimonials';
import PricingSection from '@/components/sections/pricing';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/sections/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-professor-background" data-testid="home-page">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      {/* <AboutSection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection /> */}
      <Footer />
    </div>
  );
}
