import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Code, Database, Lock, Zap, TrendingUp, BookOpen, Award, Users, ArrowRight, CheckCircle, Shield, Globe, Cpu } from "lucide-react";
import Navigation from "@/components/navigation";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function EducationSuitePage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    useCase: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/api-access-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Request Submitted!",
          description: "We'll contact you soon with API documentation and access details.",
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          jobTitle: "",
          useCase: "",
        });
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop" 
            alt="API Dashboard Analytics" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/80"></div>
        </div>
        
        {/* Decorative blur effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 z-0"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-600 to-green-600 rounded-full blur-3xl opacity-20 z-0"></div>
        
        {/* Content */}
        <div className="max-w-6xl mx-auto relative z-10 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Complete AI  Learning Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              AI Suite:
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                Powering Intelligent Learning
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
              Our comprehensive AI Suite provides powerful features for educational platforms, institutions, and EdTech startups. 
              Access AI-powered course recommendations, progress tracking, personalized learning paths, and enterprise solutions.
            </p>
            
            <div className="text-center">
              {/* <p className="text-lg sm:text-xl text-purple-300 mb-8">
                📚 Complete API documentation will be provided upon approval
              </p> */}
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              What is the AI Suite?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto">
              The ProfessorAI AI Suite is a comprehensive platform that provides educational institutions, 
              EdTech startups, and enterprises with powerful AI-driven learning tools. From developer APIs to 
              enterprise products, we offer everything you need to deliver intelligent education at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Fast Integration</h3>
                <p className="text-gray-300">
                  Get up and running in minutes with our comprehensive SDKs and clear documentation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6 text-center">
                <Cpu className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">AI-Powered</h3>
                <p className="text-gray-300">
                  Leverage advanced machine learning models trained on millions of educational interactions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Global Scale</h3>
                <p className="text-gray-300">
                  Built to handle millions of requests with 99.9% uptime and low-latency responses worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Capabilities Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Key Capabilities
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Access a comprehensive suite of AI-powered features designed specifically for educational platforms
            </p>
            <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-12">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop" 
                alt="AI-Powered Learning Analytics" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-blue-900/60 to-transparent"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-600/10 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">AI Course Recommendations</h3>
                    <p className="text-gray-300 mb-3">
                      Provide personalized course suggestions based on student interests, learning history, career goals, and skill gaps.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Machine Learning</span>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Personalization</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-600/10 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Student Progress Tracking</h3>
                    <p className="text-gray-300 mb-3">
                      Monitor and analyze student progress in real-time with detailed metrics, completion rates, and engagement analytics.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Analytics</span>
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Real-time</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-600/10 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Personalized Learning Paths</h3>
                    <p className="text-gray-300 mb-3">
                      Create adaptive learning journeys that adjust based on student performance, pace, and learning style preferences.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">Adaptive</span>
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">AI-Driven</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/20 to-green-600/10 border-green-500/20 backdrop-blur-sm hover:border-green-500/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Assessment Analytics</h3>
                    <p className="text-gray-300 mb-3">
                      Access detailed insights on quiz performance, knowledge gaps, and learning outcomes with AI-powered analysis.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Insights</span>
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Data-Driven</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/20 to-orange-600/10 border-orange-500/20 backdrop-blur-sm hover:border-orange-500/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Certification Workflows</h3>
                    <p className="text-gray-300 mb-3">
                      Automate certificate generation, verification, and distribution with blockchain-backed credential management.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Blockchain</span>
                      <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Automated</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-900/20 to-pink-600/10 border-pink-500/20 backdrop-blur-sm hover:border-pink-500/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Digital Twin Integration</h3>
                    <p className="text-gray-300 mb-3">
                      Embed AI-powered digital teacher avatars that provide 24/7 personalized instruction in multiple languages.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded">AI Avatar</span>
                      <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded">Multi-lingual</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Use Cases in Education
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              See how educational organizations are leveraging our API to transform learning experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop" 
                alt="EdTech Platform" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white">EdTech Platforms</h3>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&h=300&fit=crop" 
                alt="University Campus" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white">Universities & Colleges</h3>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop" 
                alt="Corporate Training" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/90 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white">Corporate Training</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">EdTech Platforms</h3>
                <p className="text-gray-300 mb-4">
                  Enhance your learning management system with AI-powered recommendations and adaptive learning paths.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Smart course discovery</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Personalized dashboards</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Progress analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Universities & Colleges</h3>
                <p className="text-gray-300 mb-4">
                  Scale personalized education across thousands of students with automated insights and support.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Student success tracking</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Early intervention alerts</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Credential management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Corporate Training</h3>
                <p className="text-gray-300 mb-4">
                  Build custom training programs with AI-driven skill assessments and personalized upskilling paths.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Skill gap analysis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Custom learning paths</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>ROI measurement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Flow Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Simple Integration Flow
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get started with ProfessorAI Products API in four easy steps
            </p>
            <div className="relative max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-12">
              <img 
                src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1000&h=400&fit=crop" 
                alt="API Integration Code" 
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-purple-900/50 to-blue-900/50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Code className="w-20 h-20 text-white/30" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-purple-500/50">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Sign Up</h3>
                <p className="text-gray-300 text-sm">
                  Create your developer account and get instant access to API credentials and sandbox environment.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 -translate-x-1/2"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-blue-500/50">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Integrate</h3>
                <p className="text-gray-300 text-sm">
                  Use our SDKs (Python, JavaScript, Java) or REST API to integrate features into your application.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 -translate-x-1/2"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-cyan-500/50">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Test</h3>
                <p className="text-gray-300 text-sm">
                  Test your integration in our sandbox with sample data and comprehensive debugging tools.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500 to-green-500 -translate-x-1/2"></div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-green-500/50">
                4
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Deploy</h3>
              <p className="text-gray-300 text-sm">
                Go live with production credentials and start transforming learning experiences at scale.
              </p>
            </div>
          </div>

          {/* Code Example */}
          <div className="mt-12 bg-gray-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Quick Start Example</h4>
              <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">JavaScript</span>
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`// Initialize the ProfessorAI SDK
import { ProfessorAI } from '@professorai/sdk';

const client = new ProfessorAI({
  apiKey: process.env.PROFESSORAI_API_KEY
});

// Get personalized course recommendations
const recommendations = await client.courses.getRecommendations({
  userId: 'user_123',
  interests: ['machine-learning', 'data-science'],
  skillLevel: 'intermediate'
});

// Track student progress
await client.progress.update({
  userId: 'user_123',
  courseId: 'course_456',
  completionPercentage: 75,
  lastAccessedModule: 'module_8'
});`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Authentication & Security Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Authentication & Security
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Enterprise-grade security built into every API call
            </p>
            <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-12">
              <img 
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=400&fit=crop" 
                alt="Security and Authentication" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/60 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-24 h-24 text-white/20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">OAuth 2.0 & API Keys</h3>
                    <p className="text-gray-300 mb-4">
                      Secure authentication using industry-standard OAuth 2.0 protocol or API key-based authentication for server-to-server communication.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Token-based authentication</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Automatic token refresh</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Scoped permissions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Data Encryption & Privacy</h3>
                    <p className="text-gray-300 mb-4">
                      All data transmitted through our API is encrypted using TLS 1.3. We're GDPR, FERPA, and COPPA compliant.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>End-to-end encryption</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Data residency options</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Regular security audits</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Rate Limiting & Quotas</h3>
                    <p className="text-gray-300 mb-4">
                      Fair usage policies with generous rate limits. Upgrade plans available for high-volume applications.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>10,000 requests per hour (Free tier)</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Custom limits for enterprise</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Real-time usage monitoring</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Webhook Events</h3>
                    <p className="text-gray-300 mb-4">
                      Receive real-time notifications about important events via secure webhooks with signature verification.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Course completion events</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Progress milestones</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Certificate issuance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Scalability Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Built for Scale
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Infrastructure designed to grow with your platform
            </p>
            <div className="relative max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-12">
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&h=500&fit=crop" 
                alt="Global Infrastructure" 
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <Globe className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-2xl font-bold text-white">Global Edge Network</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-3">
                99.9%
              </div>
              <div className="text-xl text-white mb-2">Uptime SLA</div>
              <div className="text-gray-400">Guaranteed availability</div>
            </div>

            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                &lt;100 ms
              </div>
              <div className="text-xl text-white mb-2">Response Time</div>
              <div className="text-gray-400">P95 latency worldwide</div>
            </div>

            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 mb-3">
                1,000,000+
              </div>
              <div className="text-xl text-white mb-2">Requests/Second</div>
              <div className="text-gray-400">Peak capacity handling</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-400" />
                  Global CDN & Edge Computing
                </h3>
                <p className="text-gray-300">
                  Our API is distributed across multiple regions worldwide with edge computing capabilities, 
                  ensuring low latency and high availability for users anywhere in the world.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  Auto-Scaling Infrastructure
                </h3>
                <p className="text-gray-300">
                  Our infrastructure automatically scales to handle traffic spikes during peak learning hours, 
                  exam periods, or course launches without any configuration needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Access Request Form Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Request API Access
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-4">
              Fill out the form below to request access to our AI Suite API.
            </p>
            <p className="text-base text-purple-300">
              We'll review your request and provide you with complete documentation and API credentials.
            </p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="Company/Institution Name *"
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

                <Textarea
                  name="useCase"
                  placeholder="Tell us about your use case and how you plan to use the API..."
                  value={formData.useCase}
                  onChange={handleChange}
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white py-6 text-base sm:text-lg"
                >
                  Submit Request
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Documentation provided upon approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>24/7 developer support</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 ProfessorsAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
