import { Card, CardContent } from '@/components/ui/card';
import { Star, User } from 'lucide-react';

const testimonials = [
  {
    rating: 5,
    text: "Professor AI has completely changed how I approach learning. The personalized feedback and 24/7 availability make it feel like having a dedicated tutor.",
    author: "Sarah Johnson",
    role: "Computer Science Student",
    gradient: "from-primary/5 to-white",
    border: "border-primary/10 hover:border-primary/30",
    iconBg: "bg-primary",
  },
  {
    rating: 5,
    text: "As an educator, I'm amazed by how Professor AI adapts to different learning styles. It's like having an AI assistant for every student.",
    author: "Dr. Michael Chen",
    role: "Mathematics Professor",
    gradient: "from-accent/5 to-white",
    border: "border-accent/10 hover:border-accent/30",
    iconBg: "bg-accent",
  },
  {
    rating: 5,
    text: "The conversational interface makes learning feel natural. I can ask questions in my own words and get explanations that actually make sense.",
    author: "Emma Rodriguez",
    role: "High School Student",
    gradient: "from-green-500/5 to-white",
    border: "border-green-500/10 hover:border-green-500/30",
    iconBg: "bg-green-500",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4" data-testid="testimonials-title">
            What Students & Teachers <span className="text-gradient">Are Saying</span>
          </h2>
          <p className="text-xl text-muted" data-testid="testimonials-description">
            Join thousands of learners who have transformed their education with Professor AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className={`bg-gradient-to-br ${testimonial.gradient} p-8 border ${testimonial.border} transition-all`}
              data-testid={`testimonial-card-${index}`}
            >
              <CardContent className="p-0">
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted mb-6 italic" data-testid={`testimonial-text-${index}`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${testimonial.iconBg} rounded-full flex items-center justify-center`}>
                    <User className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-secondary" data-testid={`testimonial-author-${index}`}>
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-muted" data-testid={`testimonial-role-${index}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
