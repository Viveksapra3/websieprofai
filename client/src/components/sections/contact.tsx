import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-4 sm:mb-6" data-testid="contact-title">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-base sm:text-lg text-muted mb-6 sm:mb-8" data-testid="contact-description">
              Have questions about Professor AI? Our team is here to help you get started on your learning journey.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4" data-testid="contact-email">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Mail className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary">Email Us</h4>
                  <p className="text-muted">support@professorai.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4" data-testid="contact-phone">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <Phone className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary">Call Us</h4>
                  <p className="text-muted">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4" data-testid="contact-chat">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary">Live Chat</h4>
                  <p className="text-muted">Available 24/7 for support</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 sm:mt-12">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400" 
                alt="Customer service support" 
                className="rounded-xl shadow-lg w-full"
                data-testid="contact-image"
              />
            </div>
          </div>
          
          <Card className="bg-gradient-to-br from-professor-background to-white shadow-xl" data-testid="contact-form-card">
            <CardHeader className="p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-secondary">Send us a message</h3>
            </CardHeader>
            
            <CardContent className="p-6 sm:p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="block text-sm font-medium text-secondary mb-2">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full"
                      data-testid="input-first-name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="block text-sm font-medium text-secondary mb-2">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full"
                      data-testid="input-last-name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full"
                    data-testid="input-email"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject" className="block text-sm font-medium text-secondary mb-2">
                    Subject
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('subject', value)} required>
                    <SelectTrigger className="w-full" data-testid="select-subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full"
                    data-testid="textarea-message"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all"
                  data-testid="button-send-message"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
