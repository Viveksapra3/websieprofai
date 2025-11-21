import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Check, X } from 'lucide-react';

interface UsernameSelectionModalProps {
  isOpen: boolean;
  onConfirm: (username: string) => void;
  userEmail: string;
  suggestedUsername: string;
}

export default function UsernameSelectionModal({ 
  isOpen, 
  onConfirm, 
  userEmail,
  suggestedUsername 
}: UsernameSelectionModalProps) {
  const [username, setUsername] = useState(suggestedUsername);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      setIsAvailable(null);
      setError('Username must be at least 3 characters');
      return;
    }

    // Basic validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(usernameToCheck)) {
      setIsAvailable(false);
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToCheck }),
      });

      const data = await response.json();
      setIsAvailable(data.available);
      
      if (!data.available) {
        setError('Username is already taken');
      }
    } catch (err) {
      setError('Failed to check username availability');
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setIsAvailable(null);
    setError(null);
  };

  const handleBlur = () => {
    if (username) {
      checkUsernameAvailability(username);
    }
  };

  const handleConfirm = () => {
    if (isAvailable && username) {
      onConfirm(username);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 bg-white/95 backdrop-blur-lg border-2 border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Choose Your Username
          </CardTitle>
          <CardDescription className="text-gray-600">
            Signing up as: <span className="font-semibold text-gray-900">{userEmail}</span>
          </CardDescription>
          <CardDescription className="text-gray-600 pt-2">
            Pick a unique username for your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Username Input */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                onBlur={handleBlur}
                placeholder="Enter username"
                className="pr-10"
                maxLength={20}
                autoFocus
              />
              {isChecking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
              {!isChecking && isAvailable === true && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
              {!isChecking && isAvailable === false && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              )}
            </div>
            
            {/* Validation Messages */}
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <X className="w-4 h-4" />
                {error}
              </p>
            )}
            {isAvailable === true && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Username is available!
              </p>
            )}
            
            {/* Helper Text */}
            <p className="text-xs text-gray-500">
              3-20 characters. Letters, numbers, and underscores only.
            </p>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            disabled={!isAvailable || isChecking}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isChecking ? 'Checking...' : isAvailable ? 'Continue' : 'Check Availability'}
          </Button>

          {/* Suggestion */}
          {isAvailable === false && (
            <div className="text-center">
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
                      setUsername(suggestion);
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
        </CardContent>
      </Card>
    </div>
  );
}
