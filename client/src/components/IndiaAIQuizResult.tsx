import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Award, TrendingUp, RotateCcw, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuizResultProps {
  moduleNumber: number;
  score: number;
  totalQuestions: number;
  answers: number[];
  questions: Array<{
    Question: string;
    Options: string[];
    "Correct Option": string;
  }>;
  onRetake: () => void;
  onContinue: () => void;
}

export function IndiaAIQuizResult({
  moduleNumber,
  score,
  totalQuestions,
  answers,
  questions,
  onRetake,
  onContinue,
}: QuizResultProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 60;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white mb-6">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {passed ? (
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <Award className="h-10 w-10 text-green-400" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <TrendingUp className="h-10 w-10 text-yellow-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold mb-2">
            {passed ? "Congratulations! 🎉" : "Good Effort! 💪"}
          </CardTitle>
          <p className="text-gray-300 text-sm sm:text-base">
            Module {moduleNumber} Assessment Results
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-5xl sm:text-6xl font-bold mb-2">
              <span className={passed ? "text-green-400" : "text-yellow-400"}>
                {score}
              </span>
              <span className="text-gray-500">/{totalQuestions}</span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">Questions Correct</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Your Score</span>
              <span className={`font-semibold ${passed ? "text-green-400" : "text-yellow-400"}`}>
                {percentage}%
              </span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          {/* Message */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <p className="text-center text-sm sm:text-base text-gray-300">
              {passed
                ? "Excellent work! You've demonstrated a strong understanding of this module's concepts."
                : "You're making progress! Review the module content and try again to strengthen your understanding."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={onRetake}
              variant="outline"
              className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
            <Button
              onClick={onContinue}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Continue Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Question Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, index) => {
            const userAnswerIndex = answers[index];
            const userAnswer = typeof userAnswerIndex === "number" ? question.Options[userAnswerIndex] : null;
            const correctAnswer = question["Correct Option"];
            const isCorrect = userAnswer === correctAnswer;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  isCorrect
                    ? "bg-green-900/20 border-green-700/50"
                    : "bg-red-900/20 border-red-700/50"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base mb-2">
                      Question {index + 1}: {question.Question}
                    </p>
                    <div className="space-y-2 text-sm">
                      {!isCorrect && userAnswer && (
                        <div className="flex items-start gap-2">
                          <span className="text-red-400 font-medium">Your answer:</span>
                          <span className="text-gray-300">{userAnswer}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 font-medium">Correct answer:</span>
                        <span className="text-gray-300">{correctAnswer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
