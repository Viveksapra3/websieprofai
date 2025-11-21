import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, GraduationCap, BookOpen, Check, X, Mail } from 'lucide-react';
import * as Select from '@radix-ui/react-select';

interface ProfileData {
  username: string;
  role: 'student' | 'teacher' | null;
  // Student fields
  studentType?: 'college' | 'school' | '';
  collegeName?: string;
  degree?: string;
  schoolClass?: string;
  schoolAffiliation?: string;
  // Teacher fields
  institution?: string;
  subject?: string;
  experience?: string;
  termsAccepted: boolean;
}

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onComplete: (data: ProfileData) => void;
  userEmail: string;
  suggestedUsername: string;
}

export default function ProfileCompletionModal({ 
  isOpen, 
  onComplete, 
  userEmail,
  suggestedUsername 
}: ProfileCompletionModalProps) {
  const [step, setStep] = useState(1); // 1: Role, 2: Username, 3: Profile Details, 4: Terms
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    username: suggestedUsername,
    role: null,
    studentType: '',
    collegeName: '',
    degree: '',
    schoolClass: '',
    schoolAffiliation: '',
    institution: '',
    subject: '',
    experience: '',
    termsAccepted: false,
  });

  if (!isOpen) return null;

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      setUsernameAvailable(null);
      setUsernameError('Username must be at least 3 characters');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(usernameToCheck)) {
      setUsernameAvailable(false);
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setIsCheckingUsername(true);
    setUsernameError(null);

    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToCheck }),
      });

      const data = await response.json();
      setUsernameAvailable(data.available);
      
      if (!data.available) {
        setUsernameError('Username is already taken');
      }
    } catch (err) {
      setUsernameError('Failed to check username availability');
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    setProfileData({ ...profileData, username: value });
    setUsernameAvailable(null);
    setUsernameError(null);
  };

  const handleUsernameBlur = () => {
    if (profileData.username) {
      checkUsernameAvailability(profileData.username);
    }
  };

  const canProceedFromStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1: // Role selection
        return profileData.role !== null;
      case 2: // Username - Always allow proceeding if username has minimum length
        return profileData.username.length >= 3;
      case 3: // Profile details AND Terms
        // Check profile details
        let profileComplete = false;
        if (profileData.role === 'student') {
          if (profileData.studentType === 'college') {
            profileComplete = !!(profileData.collegeName && profileData.degree);
          } else if (profileData.studentType === 'school') {
            profileComplete = !!(profileData.schoolClass && profileData.schoolAffiliation);
          }
        } else if (profileData.role === 'teacher') {
          profileComplete = !!(profileData.institution && profileData.subject);
        }
        // Must have profile complete AND terms accepted
        return profileComplete && profileData.termsAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedFromStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        onComplete(profileData);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <Card className="w-full max-w-2xl my-8 bg-white/95 backdrop-blur-lg border-2 border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-gray-600">
            Signing up as: <span className="font-semibold text-gray-900">{userEmail}</span>
          </CardDescription>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-blue-500'
                    : s < step
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Step {step} of 3: {
              step === 1 ? 'Select Role' :
              step === 2 ? 'Choose Username' :
              'Complete Profile'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
                Select Your Role
              </h3>
              
              <button
                onClick={() => setProfileData({ ...profileData, role: 'student' })}
                className={`w-full p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                  profileData.role === 'student'
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    profileData.role === 'student' ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    <GraduationCap className={`w-6 h-6 ${
                      profileData.role === 'student' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Student</h3>
                    <p className="text-sm text-gray-600">
                      Access courses, learn with AI tutors, and track your progress
                    </p>
                  </div>
                  {profileData.role === 'student' && (
                    <Check className="w-6 h-6 text-blue-500" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setProfileData({ ...profileData, role: 'teacher' })}
                className={`w-full p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                  profileData.role === 'teacher'
                    ? 'border-purple-500 bg-purple-50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    profileData.role === 'teacher' ? 'bg-purple-500' : 'bg-gray-200'
                  }`}>
                    <BookOpen className={`w-6 h-6 ${
                      profileData.role === 'teacher' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Teacher</h3>
                    <p className="text-sm text-gray-600">
                      Create courses, upload content, and manage your students
                    </p>
                  </div>
                  {profileData.role === 'teacher' && (
                    <Check className="w-6 h-6 text-purple-500" />
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Username Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
                Choose Your Username
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={profileData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    onBlur={handleUsernameBlur}
                    placeholder="Enter username"
                    className="pr-10"
                    maxLength={20}
                    autoFocus
                  />
                  {isCheckingUsername && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {!isCheckingUsername && usernameAvailable === true && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                  {!isCheckingUsername && usernameAvailable === false && (
                    <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  )}
                </div>
                
                {usernameError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {usernameError}
                  </p>
                )}
                {usernameAvailable === true && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Username is available!
                  </p>
                )}
                
                <p className="text-xs text-gray-500">
                  3-20 characters. Letters, numbers, and underscores only.
                </p>
              </div>

              {usernameAvailable === false && (
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600 mb-2">Try these suggestions:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      `${suggestedUsername}${Math.floor(Math.random() * 100)}`,
                      `${suggestedUsername}_${Math.floor(Math.random() * 1000)}`,
                      `${suggestedUsername}${new Date().getFullYear()}`,
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setProfileData({ ...profileData, username: suggestion });
                          checkUsernameAvailability(suggestion);
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Profile Details */}
          {step === 3 && profileData.role === 'student' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
                Student Information
              </h3>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">I am a</Label>
                <Select.Root
                  value={profileData.studentType}
                  onValueChange={(value) => setProfileData({ ...profileData, studentType: value as 'college' | 'school' })}
                >
                  <Select.Trigger className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between">
                    <Select.Value placeholder="Select student type" />
                    <Select.Icon>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden z-[9999]">
                      <Select.Viewport>
                        <Select.Item value="college" className="px-4 py-2 hover:bg-gray-100 cursor-pointer outline-none focus:bg-gray-100">
                          <Select.ItemText>College Student</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="school" className="px-4 py-2 hover:bg-gray-100 cursor-pointer outline-none focus:bg-gray-100">
                          <Select.ItemText>School Student</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              {profileData.studentType === 'college' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="collegeName" className="text-gray-700 font-medium">
                      College/University Name *
                    </Label>
                    <Input
                      id="collegeName"
                      value={profileData.collegeName}
                      onChange={(e) => setProfileData({ ...profileData, collegeName: e.target.value })}
                      placeholder="Enter your college name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree" className="text-gray-700 font-medium">
                      Degree/Course *
                    </Label>
                    <Input
                      id="degree"
                      value={profileData.degree}
                      onChange={(e) => setProfileData({ ...profileData, degree: e.target.value })}
                      placeholder="e.g., B.Tech Computer Science"
                    />
                  </div>
                </>
              )}

              {profileData.studentType === 'school' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="schoolClass" className="text-gray-700 font-medium">
                      Class/Grade *
                    </Label>
                    <Input
                      id="schoolClass"
                      value={profileData.schoolClass}
                      onChange={(e) => setProfileData({ ...profileData, schoolClass: e.target.value })}
                      placeholder="e.g., 10th Grade"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolAffiliation" className="text-gray-700 font-medium">
                      School Board/Affiliation *
                    </Label>
                    <Input
                      id="schoolAffiliation"
                      value={profileData.schoolAffiliation}
                      onChange={(e) => setProfileData({ ...profileData, schoolAffiliation: e.target.value })}
                      placeholder="e.g., CBSE, ICSE, State Board"
                    />
                  </div>
                </>
              )}

              {/* Terms Acceptance - Added to Step 3 for Students */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="terms-student"
                    checked={profileData.termsAccepted}
                    onChange={(e) => setProfileData({ ...profileData, termsAccepted: e.target.checked })}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms-student" className="text-sm text-gray-700 cursor-pointer">
                    I have read and agree to the{' '}
                    <a 
                      href="/terms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      Terms of Use
                    </a>
                    {' '}and{' '}
                    <a 
                      href="/terms#privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && profileData.role === 'teacher' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
                Teacher Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="institution" className="text-gray-700 font-medium">
                  Institution/Organization *
                </Label>
                <Input
                  id="institution"
                  value={profileData.institution}
                  onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                  placeholder="Enter your institution name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-gray-700 font-medium">
                  Subject/Specialization *
                </Label>
                <Input
                  id="subject"
                  value={profileData.subject}
                  onChange={(e) => setProfileData({ ...profileData, subject: e.target.value })}
                  placeholder="e.g., Mathematics, Physics, Computer Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-gray-700 font-medium">
                  Years of Experience (Optional)
                </Label>
                <Input
                  id="experience"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  placeholder="e.g., 5 years"
                />
              </div>

              {/* Terms Acceptance - Added to Step 3 */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={profileData.termsAccepted}
                    onChange={(e) => setProfileData({ ...profileData, termsAccepted: e.target.checked })}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    I have read and agree to the{' '}
                    <a 
                      href="/terms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      Terms of Use
                    </a>
                    {' '}and{' '}
                    <a 
                      href="/terms#privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceedFromStep(step)}
              className={`${step === 1 ? 'w-full' : 'flex-1'} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {step === 3 ? 'Complete Sign Up' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
