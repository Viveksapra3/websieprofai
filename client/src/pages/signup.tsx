import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft, Mail, User, Lock, ChevronDown, Check } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import logoPath from "@assets/prof-ai-logo_1755775207766-DKA28TFR.avif";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // <-- default role
    // Student fields
    studentType: '', // 'college' | 'school'
    collegeName: '',
    degree: '',
    schoolClass: '',
    schoolAffiliation: '',
    // Terms acceptance
    termsAccepted: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic client validations
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!formData.termsAccepted) {
      alert('You must agree to the Terms of Use to sign up.');
      return;
    }
    if (formData.role === 'student') {
      const type = (formData.studentType || '').toLowerCase();
      if (!type) {
        alert('Please select whether you are a college or school student.');
        return;
      }
      if (type === 'college') {
        if (!formData.collegeName || !formData.degree) {
          alert('Please provide your college name and degree.');
          return;
        }
      }
      if (type === 'school') {
        if (!formData.schoolClass || !formData.schoolAffiliation) {
          alert('Please provide your class and school affiliation.');
          return;
        }
      }
    }

    try {
      const payload: any = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        termsAccepted: formData.termsAccepted,
      };

      if (formData.role === 'student') {
        payload.studentType = formData.studentType || undefined;
        if ((formData.studentType || '').toLowerCase() === 'college') {
          payload.collegeName = formData.collegeName || undefined;
          payload.degree = formData.degree || undefined;
        } else if ((formData.studentType || '').toLowerCase() === 'school') {
          payload.schoolClass = formData.schoolClass || undefined;
          payload.schoolAffiliation = formData.schoolAffiliation || undefined;
        }
      }

      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data);
        const redirectUrl = data?.redirectUrl || (import.meta.env.VITE_AUTH_REDIRECT_URL as string) || '/';
        // Full page redirect (cross-domain supported)
        window.location.href = redirectUrl;
      } else {
        console.error('Signup failed:', data.error);
        // Handle error display to user
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 flex items-center justify-center p-4" data-testid="signup-page">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="relative w-full max-w-md">
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
                data-testid="signup-logo"
              />
            </div>
            <CardDescription className="text-white/70">
              Start your personalized learning journey today
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white/90 font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
                    data-testid="input-full-name"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
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
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/90 font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
                    data-testid="input-confirm-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                    data-testid="toggle-confirm-password-visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Dropdown (Student | Teacher) */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white/90 font-medium">
                  Sign up as
                </Label>
                <div className="relative">
                  <Select.Root
                    value={formData.role}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, role: v }))}
                  >
                    <Select.Trigger
                      aria-label="Role"
                      className="w-full inline-flex items-center justify-between pl-4 pr-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-accent focus:ring-0 hover:bg-white/10"
                      data-testid="select-role"
                    >
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4 text-white" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content
                        sideOffset={6}
                        className="z-50 overflow-hidden rounded-md border border-white/20 bg-gray/80 backdrop-blur-md text-white shadow-lg"
                      >
                        <Select.Viewport className="p-1">
                          <Select.Item
                            value="student"
                            className="select-none rounded px-2 py-1 text-sm outline-none hover:bg-white/10 cursor-pointer"
                          >
                            <Select.ItemText>Student</Select.ItemText>
                          </Select.Item>
                          <Select.Item
                            value="teacher"
                            className="select-none rounded px-2 py-1 text-sm outline-none hover:bg-white/10 cursor-pointer"
                          >
                            <Select.ItemText>Teacher</Select.ItemText>
                          </Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              </div>

              {/* Student specific fields */}
              {formData.role === 'student' && (
                <div className="space-y-3">
                  {/* Student Type: College or School */}
                  <div className="space-y-2">
                    <Label className="text-white/90 font-medium">Student type</Label>
                    <div className="relative">
                      <Select.Root
                        value={formData.studentType}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, studentType: v, collegeName: '', degree: '', schoolClass: '', schoolAffiliation: '' }))}
                      >
                        <Select.Trigger
                          aria-label="Student Type"
                          className="w-full inline-flex items-center justify-between pl-4 pr-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-accent focus:ring-0 hover:bg-white/10"
                        >
                          <Select.Value placeholder="Select student type" />
                          <Select.Icon>
                            <ChevronDown className="w-4 h-4 text-white" />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content sideOffset={6} className="z-50 overflow-hidden rounded-md border border-white/20 bg-gray/80 backdrop-blur-md text-white shadow-lg">
                            <Select.Viewport className="p-1">
                              <Select.Item value="college" className="select-none rounded px-2 py-1 text-sm outline-none hover:bg-white/10 cursor-pointer">
                                <Select.ItemText>College</Select.ItemText>
                              </Select.Item>
                              <Select.Item value="school" className="select-none rounded px-2 py-1 text-sm outline-none hover:bg-white/10 cursor-pointer">
                                <Select.ItemText>School</Select.ItemText>
                              </Select.Item>
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>
                  </div>

                  {/* Conditional inputs */}
                  {(formData.studentType || '').toLowerCase() === 'college' && (
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="collegeName" className="text-white/90 font-medium">College Name</Label>
                        <Input id="collegeName" name="collegeName" type="text" placeholder="Enter college name" value={formData.collegeName} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="degree" className="text-white/90 font-medium">Degree</Label>
                        <Input id="degree" name="degree" type="text" placeholder="e.g. B.Tech, B.Sc, MBA" value={formData.degree} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent" />
                      </div>
                    </div>
                  )}

                  {(formData.studentType || '').toLowerCase() === 'school' && (
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="schoolClass" className="text-white/90 font-medium">Class</Label>
                        <Input id="schoolClass" name="schoolClass" type="text" placeholder="e.g. 8th, 10th, 12th" value={formData.schoolClass} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schoolAffiliation" className="text-white/90 font-medium">Affiliation</Label>
                        <Input id="schoolAffiliation" name="schoolAffiliation" type="text" placeholder="e.g. CBSE, ICSE, State Board" value={formData.schoolAffiliation} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* <Check className="w-4 h-4 text-white" /> */}
              <div className="flex items-center gap-2 text-white/90">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-white/30 bg-white/10"
                />
                <Label htmlFor="termsAccepted" className="text-white/90 select-none">
                  I agree to the{' '}
                  <Link href="/terms">
                    <span className="text-accent hover:text-accent/80 underline cursor-pointer">Terms of Use</span>
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-accent via-primary to-accent bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/30 text-white border-2 border-white/50 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!formData.termsAccepted}
                data-testid="button-create-account"
              >
                Create Account
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

            {/* Social Signup Options */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                data-testid="button-google-signup"
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
                data-testid="button-github-signup"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-white/70">
                Already have an account?{' '}
                <Link href="/signin/student">
                  <span className="text-accent hover:text-accent/80 font-medium cursor-pointer transition-colors">
                    Sign in
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
