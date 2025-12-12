import { useState } from "react";
import { INDIA_AI_MCQS, IndiaAIModuleId } from "@/data/india-ai-mcqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

interface IndiaAIModuleQuizProps {
  moduleNumber: IndiaAIModuleId;
  quizType?: "mid" | "end"; // "mid" for mid-module quiz, "end" for end-of-module quiz
  onComplete: (score: number, answers: number[]) => void;
}

export function IndiaAIModuleQuiz({ moduleNumber, quizType = "end", onComplete }: IndiaAIModuleQuizProps) {
  const key = `Module - ${moduleNumber}` as const;
  const moduleData = INDIA_AI_MCQS[key];
  
  // Get questions based on quiz type
  const questions = quizType === "mid" && moduleData?.midModule 
    ? moduleData.midModule.questions 
    : moduleData?.endModule || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions.length) {
    return (
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Module Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Questions for this module are not available yet.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentIndex];
  const total = questions.length;

  const handleOptionSelect = (index: number) => {
    if (submitted) return;
    setSelected(index);
  };

  const handleNext = () => {
    if (selected === null) return;

    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = selected;
    setAnswers(nextAnswers);

    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(nextAnswers[currentIndex + 1] ?? null);
    } else {
      let correctCount = 0;
      questions.forEach((q, i) => {
        const chosenIndex = nextAnswers[i];
        if (typeof chosenIndex === "number" && q.Options[chosenIndex] === q["Correct Option"]) {
          correctCount += 1;
        }
      });
      setScore(correctCount);
      setSubmitted(true);
      onComplete(correctCount, nextAnswers);
    }
  };

  const progressValue = ((currentIndex) / total) * 100;

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {quizType === "mid" ? `Module ${moduleNumber} Mid-Quiz` : `Module ${moduleNumber} Assessment`}
          </CardTitle>
          <div className="text-sm text-gray-300">
            Question {currentIndex + 1} of {total}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressValue} className="h-2" />

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">
            {currentQuestion.Question}
          </h3>
          <div className="space-y-2">
            {currentQuestion.Options.map((opt, idx) => {
              const isSelected = selected === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left px-4 py-2 rounded-lg border text-sm transition-colors ${
                    isSelected
                      ? "bg-orange-600 border-orange-400 text-white"
                      : "bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-700"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={selected === null}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {currentIndex < total - 1 ? "Next" : "Submit Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
