import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, TrendingUp, Award, CheckCircle, Globe, Shield, Zap } from "lucide-react";
import Navigation from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ProfAIBusinessPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    companySize: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    console.log("Pricing inquiry submitted:", formData);
    
    toast({
      title: "Inquiry Submitted!",
      description: "Our sales team will contact you within 24 hours with pricing details.",
    });

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      companySize: "",
      message: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop" 
            alt="Business Team Collaboration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/80"></div>
        </div>
        
        {/* Decorative blur effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 z-0"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-600 to-green-600 rounded-full blur-3xl opacity-20 z-0"></div>
        
        {/* Content */}
        <div className="max-w-6xl mx-auto relative z-10 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
                Get AI Trainer for Your Organization
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
                Bring the power of AI-driven learning to your institution. Our comprehensive platform is designed to transform education for schools, colleges, universities, and training organizations.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <span>Complete platform for your institution</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <span>Customizable for your organization</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <span>Dedicated support & training</span>
                </div>
              </div>
            </div>

            {/* Request Demo Form */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Get Pricing Information</h2>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Input
                        name="firstName"
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Input
                        name="lastName"
                        placeholder="Last Name *"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <Input
                    name="email"
                    type="email"
                    placeholder="Work Email *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <Input
                    name="company"
                    placeholder="Company Name *"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <Input
                    name="jobTitle"
                    placeholder="Job Title *"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                  >
                    <option value="" className="bg-gray-900">Company Size *</option>
                    <option value="1-20" className="bg-gray-900">1-20 employees</option>
                    <option value="21-50" className="bg-gray-900">21-50 employees</option>
                    <option value="51-200" className="bg-gray-900">51-200 employees</option>
                    <option value="201-500" className="bg-gray-900">201-500 employees</option>
                    <option value="501-1000" className="bg-gray-900">501-1000 employees</option>
                    <option value="1000+" className="bg-gray-900">1000+ employees</option>
                  </select>

                  <Textarea
                    name="message"
                    placeholder="Tell us about your requirements and use case..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 sm:py-5 md:py-6 text-sm sm:text-base"
                  >
                    Request Pricing
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-10 sm:mb-12 md:mb-16">
            Why choose ProfAI for your organization?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 sm:p-6 text-center">
                <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Enterprise-Grade Platform</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Robust, secure platform built specifically for educational institutions of all sizes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 sm:p-6 text-center">
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">AI-Powered Learning</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Advanced AI technology that delivers personalized learning experiences for every student.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 sm:p-6 text-center">
                <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Institutional Analytics</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Track student progress, engagement, and outcomes across your entire organization.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 sm:p-6 text-center">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Full Compliance</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Meets all educational standards, data protection regulations, and security requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-10 sm:mb-12 md:mb-16">
            Trusted by leading organizations
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-12 text-center">
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-400 mb-2 sm:mb-3">15,000+</div>
              <div className="text-base sm:text-lg md:text-xl text-gray-300">Students</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-400 mb-2 sm:mb-3">500+</div>
              <div className="text-base sm:text-lg md:text-xl text-gray-300">Schools Supported </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400 mb-2 sm:mb-3">4,500,000</div>
              <div className="text-base sm:text-lg md:text-xl text-gray-300">Awards of Avatar interaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to bring ProfAI to your organization?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
            Join thousands of institutions already using ProfAI to deliver exceptional learning experiences and transform education.
          </p>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-full">
            Request Pricing
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2025 ProfessorsAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
