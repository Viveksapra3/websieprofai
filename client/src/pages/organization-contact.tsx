import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';
import { ArrowLeft, Building, Users, Mail, Phone, Globe, CheckCircle } from 'lucide-react';
import logoPath from "@assets/ProfAI-Updated.svg";

export default function OrganizationContact() {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    organizationType: '',
    teamSize: '',
    requirements: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError(null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.organizationName.trim() || !formData.contactPerson.trim() || !formData.email.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just log the data (replace with actual API call)
      console.log('Organization contact form submitted:', formData);
      
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative w-full max-w-md">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={logoPath} 
                  alt="ProfessorsAI Logo" 
                  className="h-12 w-auto"
                />
              </div>
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-green-100">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Thank You!</CardTitle>
              <p className="text-white/70">
                We've received your organization's information. Our team will contact you within 24 hours to discuss your training needs.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="relative w-full max-w-2xl">
        {/* Back to Home Link */}
        <Link href="/">
          <Button 
            variant="ghost" 
            className="absolute z-[100] left-0 text-white/70 hover:text-white hover:scale-110 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl mt-16">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src={logoPath} 
                alt="ProfessorsAI Logo" 
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Building className="w-6 h-6 text-purple-400" />
              <CardTitle className="text-2xl font-bold text-white">
                Organization Partnership
              </CardTitle>
            </div>
            <p className="text-white/70">
              Tell us about your organization and training needs. We'll create a customized solution for your team.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  Organization Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-white/90 font-medium">
                      Organization Name *
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                      <Input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        placeholder="Your organization name"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationType" className="text-white/90 font-medium">
                      Organization Type
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange('organizationType', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 backdrop-blur-md border border-white/20">
                        <SelectItem value="corporation" className="text-white hover:bg-white focus:bg-white">Corporation</SelectItem>
                        <SelectItem value="startup" className="text-white hover:bg-white focus:bg-white">Startup</SelectItem>
                        <SelectItem value="nonprofit" className="text-white hover:bg-white focus:bg-white">Non-profit</SelectItem>
                        <SelectItem value="government" className="text-white hover:bg-white focus:bg-white">Government</SelectItem>
                        <SelectItem value="healthcare" className="text-white hover:bg-white focus:bg-white">Healthcare</SelectItem>
                        <SelectItem value="education" className="text-white hover:bg-white focus:bg-white">Educational Institution</SelectItem>
                        <SelectItem value="other" className="text-white hover:bg-white focus:bg-white">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-white/90 font-medium">
                    Website
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://yourorganization.com"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="text-white/90 font-medium">
                      Contact Person *
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        type="text"
                        placeholder="Full name"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90 font-medium">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contact@organization.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/90 font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Training Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  Training Requirements
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamSize" className="text-white/90 font-medium">
                      Team Size
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange('teamSize', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 backdrop-blur-md border border-white/20">
                        <SelectItem value="1-10" className="text-white hover:bg-white focus:bg-white">1-10 employees</SelectItem>
                        <SelectItem value="11-50" className="text-white hover:bg-white focus:bg-white">11-50 employees</SelectItem>
                        <SelectItem value="51-200" className="text-white hover:bg-white focus:bg-white">51-200 employees</SelectItem>
                        <SelectItem value="201-1000" className="text-white hover:bg-white focus:bg-white">201-1000 employees</SelectItem>
                        <SelectItem value="1000+" className="text-white hover:bg-white focus:bg-white">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline" className="text-white/90 font-medium">
                      Implementation Timeline
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange('timeline', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 backdrop-blur-md border border-white/20">
                        <SelectItem value="immediate" className="text-white hover:bg-white focus:bg-white">Immediate (within 1 month)</SelectItem>
                        <SelectItem value="quarter" className="text-white hover:bg-white focus:bg-white">This quarter (1-3 months)</SelectItem>
                        <SelectItem value="half-year" className="text-white hover:bg-white focus:bg-white">Next 6 months</SelectItem>
                        <SelectItem value="year" className="text-white hover:bg-white focus:bg-white">Within a year</SelectItem>
                        <SelectItem value="exploring" className="text-white hover:bg-white focus:bg-white">Just exploring options</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-white/90 font-medium">
                    Training Requirements & Goals
                  </Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    rows={4}
                    placeholder="Describe your training needs, goals, and any specific requirements..."
                    value={formData.requirements}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-4">
                {error && (
                  <div className="text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/30 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Partnership Request'}
                </Button>
              </div>
            </form>

            {/* Alternative Options */}
            <div className="text-center pt-4 border-t border-white/20">
              <p className="text-white/70 text-sm mb-4">
                Looking for individual access?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link href="/signin/student">
                  <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all">
                    Student Sign In
                  </Button>
                </Link>
                <Link href="/signin/teacher">
                  <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all">
                    Academia Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
