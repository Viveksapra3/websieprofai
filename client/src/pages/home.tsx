import Navigation from '@/components/navigation';
import HeroSection from '@/components/sections/hero2';
import CoursesSection from '@/components/sections/courses';
import AvatarTeachingSection from '@/components/sections/avatar-teaching';
import FeaturesSection from '@/components/sections/features';
import LLMComparisonSection from '@/components/sections/llm-comparison';
import HowItWorksSection from '@/components/sections/how-it-works';
import PartnersSection from '@/components/sections/partners';
import IndiaAIMissionSection from '@/components/sections/india-ai-mission';
import AboutSection from '@/components/sections/about';
import TestimonialsSection from '@/components/sections/testimonials';
import PricingSection from '@/components/sections/pricing';
import ContactSection from '@/components/sections/contact';
import BlogSection from '@/components/sections/blogs';
import Footer from '@/components/sections/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-professor-background" data-testid="home-page">
      <Navigation />
      <HeroSection />
      <CoursesSection />
      <LLMComparisonSection />
      <AvatarTeachingSection />
      <FeaturesSection />
      <HowItWorksSection />
      <IndiaAIMissionSection />
      <PartnersSection />
      {/* <AboutSection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection /> */}
      <BlogSection />
      <Footer />
    </div>
  );
}
