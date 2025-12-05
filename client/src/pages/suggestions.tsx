import { useState } from "react";
import { Link } from "wouter";
import { AuthNavbar } from "@/components/auth-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, BookOpen, Lightbulb, Send, CheckCircle2, 
  ArrowLeft, Sparkles, MessageSquare
} from "lucide-react";

interface Suggestion {
  id: number;
  name: string;
  email: string;
  type: string;
  country: string;
  syllabus: string;
  message: string;
  submittedAt: string;
}

export default function SuggestionsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    country: "",
    syllabus: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.type || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSuggestion: Suggestion = {
      id: Date.now(),
      ...formData,
      submittedAt: new Date().toLocaleString(),
    };
    
    setSuggestions(prev => [newSuggestion, ...prev]);
    setShowSuccess(true);
    setFormData({
      name: "",
      email: "",
      type: "",
      country: "",
      syllabus: "",
      message: "",
    });
    setIsSubmitting(false);
    
    toast({
      title: "Suggestion submitted!",
      description: "Thank you for helping us improve ProfessorsAI.",
    });
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <AuthNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-4">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300">Help Us Improve</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Can't Find Your <span className="text-purple-400">Country</span> or <span className="text-blue-400">Syllabus</span>?
            </h1>
            <p className="text-xl text-gray-300">
              Drop us a line and help us expand our coverage to serve learners worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
                {showSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                    <p className="text-gray-400">Your suggestion has been submitted successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="type" className="text-white">Suggestion Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="country">Add New Country</SelectItem>
                          <SelectItem value="syllabus">Add New Syllabus</SelectItem>
                          <SelectItem value="improvement">Suggest Improvement</SelectItem>
                          <SelectItem value="feature">Request Feature</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-white flex items-center gap-2">
                          <Globe className="h-4 w-4 text-purple-400" />
                          Country
                        </Label>
                        <Input
                          id="country"
                          placeholder="e.g., Brazil, Japan, Nigeria"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="syllabus" className="text-white flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-400" />
                          Syllabus/Curriculum
                        </Label>
                        <Input
                          id="syllabus"
                          placeholder="e.g., CBSE, IB, A-Levels"
                          value={formData.syllabus}
                          onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-green-400" />
                        Your Message *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your suggestion..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit Suggestion
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submissions Table */}
      {suggestions.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-400" />
                Your Submissions
              </h2>
              <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800/50">
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Country</TableHead>
                      <TableHead className="text-gray-300">Syllabus</TableHead>
                      <TableHead className="text-gray-300">Message</TableHead>
                      <TableHead className="text-gray-300">Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suggestions.map((suggestion) => (
                      <TableRow key={suggestion.id} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell className="text-white font-medium">{suggestion.name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 capitalize">
                            {suggestion.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300">{suggestion.country || "-"}</TableCell>
                        <TableCell className="text-gray-300">{suggestion.syllabus || "-"}</TableCell>
                        <TableCell className="text-gray-300 max-w-[200px] truncate">{suggestion.message}</TableCell>
                        <TableCell className="text-gray-400 text-sm">{suggestion.submittedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 ProfessorsAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
