import Navigation from '@/components/navigation';
import HeroSection from '@/components/sections/hero2';
import CoursesSection from '@/components/sections/courses';
import AvatarTeachingSection from '@/components/sections/avatar-teaching';
import FeaturesSection from '@/components/sections/features';
import HowItWorksSection from '@/components/sections/how-it-works';
import PartnersSection from '@/components/sections/partners';
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
      <CoursesSection />
      <AvatarTeachingSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PartnersSection />
      {/* <AboutSection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection /> */}
      <Footer />
    </div>
  );
}
