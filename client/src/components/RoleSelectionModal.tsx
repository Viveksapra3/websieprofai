import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onSelectRole: (role: 'student' | 'teacher') => void;
  userEmail: string;
}

export default function RoleSelectionModal({ isOpen, onSelectRole, userEmail }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 bg-white/95 backdrop-blur-lg border-2 border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to ProfessorsAI!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Signing in as: <span className="font-semibold text-gray-900">{userEmail}</span>
          </CardDescription>
          <CardDescription className="text-gray-600 pt-2">
            Please select your role to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Student Option */}
          <button
            onClick={() => setSelectedRole('student')}
            className={`w-full p-6 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedRole === 'student'
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${
                selectedRole === 'student' ? 'bg-blue-500' : 'bg-gray-200'
              }`}>
                <GraduationCap className={`w-6 h-6 ${
                  selectedRole === 'student' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Student
                </h3>
                <p className="text-sm text-gray-600">
                  Access courses, learn with AI tutors, and track your progress
                </p>
              </div>
              {selectedRole === 'student' && (
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>

          {/* Teacher Option */}
          <button
            onClick={() => setSelectedRole('teacher')}
            className={`w-full p-6 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedRole === 'teacher'
                ? 'border-purple-500 bg-purple-50 shadow-lg scale-[1.02]'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${
                selectedRole === 'teacher' ? 'bg-purple-500' : 'bg-gray-200'
              }`}>
                <BookOpen className={`w-6 h-6 ${
                  selectedRole === 'teacher' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Teacher
                </h3>
                <p className="text-sm text-gray-600">
                  Create courses, upload content, and manage your students
                </p>
              </div>
              {selectedRole === 'teacher' && (
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            disabled={!selectedRole}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {selectedRole ? `Continue as ${selectedRole === 'student' ? 'Student' : 'Teacher'}` : 'Select a role to continue'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
