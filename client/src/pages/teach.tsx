import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, TrendingUp, Video, Award, DollarSign, Globe, Clock } from "lucide-react";
import Navigation from "@/components/navigation";

export default function TeachPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Come teach with us
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Become an instructor and change lives — including your own
          </p>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">15,000++</div>
            <div className="text-gray-300">Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">75+</div>
            <div className="text-gray-300">Languages</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">1B+</div>
            <div className="text-gray-300">Enrollments</div>
          </div>
        </div>
      </section>

      {/* Why Teach Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            So many reasons to start
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Teach your way</h3>
                <p className="text-gray-300">
                  Publish the course you want, in the way you want, and always have control of your own content.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Inspire learners</h3>
                <p className="text-gray-300">
                  Teach what you know and help learners explore their interests, gain new skills, and advance their careers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <DollarSign className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Get rewarded</h3>
                <p className="text-gray-300">
                  Expand your professional network, build your expertise, and earn money on each paid enrollment.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <Video className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Tools</h3>
                <p className="text-gray-300">
                  Use our advanced AI curriculum builder to create engaging content faster and more efficiently.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <Award className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Expert Support</h3>
                <p className="text-gray-300">
                  Get guidance from our instructor support team and connect with experienced educators worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Flexible Schedule</h3>
                <p className="text-gray-300">
                  Work on your own time, at your own pace. Create courses whenever and wherever you want.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Begin Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            How to begin
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Plan your curriculum</h3>
              <p className="text-gray-300">
                You start with your passion and knowledge. Then choose a promising topic with the help of our AI tools.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Record your video</h3>
              <p className="text-gray-300">
                Use basic tools to record your lessons. Our AI avatar can even help present your content.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Launch your course</h3>
              <p className="text-gray-300">
                Gather your first ratings and reviews by promoting your course through social media and your network.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Grow your impact</h3>
              <p className="text-gray-300">
                Continue to build your student community and expand your teaching to create more courses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Become an instructor today
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join one of the world's largest online learning marketplaces.
          </p>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 ProfAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
