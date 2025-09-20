import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, GraduationCap } from 'lucide-react';
import logoPath from "@assets/prof-ai-logo_1755775207766-DKA28TFR.avif";

export default function SignInTeacher() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // POST request to sign in as teacher
      const response = await fetch('/api/signin/teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          usernameOrEmail: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Teacher sign-in successful:', data);
        // Always redirect teachers to courses page after sign-in
        window.location.href = '/courses';
      } else {
        const error = await response.json();
        console.error('Teacher sign-in failed:', error);
        // Handle error (show error message)
      }
    } catch (error) {
      console.error('Network error:', error);
      // Handle network error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 flex items-center justify-center p-4" data-testid="signin-teacher-page">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="relative w-full max-w-md flex-row ">
        {/* Back to Home Link */}
        <Link href="/">
          <Button 
            variant="ghost" 
            className="absolute z-[100] left-0 text-white/70 hover:text-white hover:scale-110 transition-all"
            data-testid="back-to-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src={logoPath} 
                alt="Professor AI Logo" 
                className="h-12 w-auto"
                data-testid="signin-logo"
              />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <GraduationCap className="w-6 h-6 text-blue-400" />
              <CardTitle className="text-2xl font-bold text-white">
                Teacher Sign In
              </CardTitle>
            </div>
            <CardDescription className="text-white/70">
              Access your teaching dashboard and student management tools
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your teacher email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400"
                    data-testid="input-email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400"
                    data-testid="input-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                    data-testid="toggle-password-visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link href="/forgot-password">
                  <span className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer transition-colors">
                    
                  </span>
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-sign-in"
              >
                {isLoading ? 'Signing In...' : 'Sign In as Teacher'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-transparent px-2 text-white/70">Or continue with</span>
              </div>
            </div>

            {/* Social Sign In Options */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                data-testid="button-google-signin"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                data-testid="button-microsoft-signin"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 0h11.377v11.372H0V0zm12.623 0H24v11.372H12.623V0zM0 12.623h11.377V24H0V12.623zm12.623 0H24V24H12.623V12.623z"/>
                </svg>
                Microsoft
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-white/70">
                Don't have a teacher account?{' '}
                <Link href="/signup">
                  <span className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors">
                    Sign up here
                  </span>
                </Link>
              </p>
            </div>

            {/* Student Sign In Link */}
            <div className="text-center pt-2 border-t border-white/20">
              <p className="text-white/70 text-sm">
                Are you a student?{' '}
                <Link href="/signin/student">
                  <span className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer transition-colors">
                    Sign in as Student
                  </span>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
