"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { QuestionCard } from "./question-card"
import { QuizResults } from "./quiz-results"
import { QuizTimer } from "./quiz-timer"
import { fetchQuizQuestions } from "@/lib/quiz-api"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { QuizState } from "@/types/quiz"
import { ArrowLeft, Loader2, Settings } from "lucide-react"

interface QuizProps {
  onExit: () => void
}

interface QuizSettings {
  timerEnabled: boolean
  questionTime: number
}

export function Quiz({ onExit }: QuizProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    isCompleted: false,
    startTime: new Date(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useLocalStorage<QuizSettings>("quiz-settings", {
    timerEnabled: false,
    questionTime: 30,
  })
  const [timerKey, setTimerKey] = useState(0)

  useEffect(() => {
    loadQuestions()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (quizState.isCompleted || isLoading || error) return

      // Number keys 1-4 for selecting answers
      if (e.key >= "1" && e.key <= "4") {
        const answerIndex = Number.parseInt(e.key) - 1
        const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
        if (currentQuestion && answerIndex < currentQuestion.options.length) {
          handleAnswerSelect(answerIndex)
        }
      }

      // Arrow keys for navigation
      if (e.key === "ArrowRight" || e.key === "Enter") {
        const selectedAnswer = quizState.answers[quizState.currentQuestionIndex]
        if (selectedAnswer !== null && !isSubmitting) {
          handleNext()
        }
      }

      if (e.key === "ArrowLeft") {
        if (quizState.currentQuestionIndex > 0 && !isSubmitting) {
          handlePrevious()
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [quizState, isSubmitting, isLoading, error])

  const loadQuestions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const questions = await fetchQuizQuestions(8)
      setQuizState((prev) => ({
        ...prev,
        questions,
        answers: new Array(questions.length).fill(null),
      }))
      setTimerKey((prev) => prev + 1) // Reset timer
    } catch (err) {
      setError("Failed to load questions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = useCallback(
    (answerIndex: number) => {
      if (isSubmitting) return

      setQuizState((prev) => {
        const newAnswers = [...prev.answers]
        newAnswers[prev.currentQuestionIndex] = answerIndex
        return {
          ...prev,
          answers: newAnswers,
        }
      })
    },
    [isSubmitting],
  )

  const handleTimeUp = useCallback(() => {
    if (!isSubmitting) {
      handleNext()
    }
  }, [isSubmitting])

  const handleNext = useCallback(() => {
    if (isSubmitting) return

    setIsSubmitting(true)

    setTimeout(() => {
      setQuizState((prev) => {
        if (prev.currentQuestionIndex < prev.questions.length - 1) {
          setTimerKey((k) => k + 1) // Reset timer for next question
          return {
            ...prev,
            currentQuestionIndex: prev.currentQuestionIndex + 1,
          }
        } else {
          // Calculate final score
          const score = prev.questions.reduce((acc, question, index) => {
            return acc + (prev.answers[index] === question.correctAnswer ? 1 : 0)
          }, 0)

          return {
            ...prev,
            score,
            isCompleted: true,
            endTime: new Date(),
          }
        }
      })
      setIsSubmitting(false)
    }, 300)
  }, [isSubmitting])

  const handlePrevious = () => {
    if (isSubmitting) return

    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1),
    }))
    setTimerKey((prev) => prev + 1) // Reset timer
  }

  const handleRestart = () => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      isCompleted: false,
      startTime: new Date(),
    })
    setTimerKey((prev) => prev + 1)
    loadQuestions()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <p className="text-muted-foreground">Loading quiz questions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <p className="text-destructive text-center">{error}</p>
            <div className="flex gap-2">
              <Button onClick={loadQuestions} variant="outline" disabled={isLoading}>
                Try Again
              </Button>
              <Button onClick={onExit} variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizState.isCompleted) {
    return <QuizResults quizState={quizState} onRestart={handleRestart} onExit={onExit} />
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
  const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100
  const selectedAnswer = quizState.answers[quizState.currentQuestionIndex]
  const canProceed = selectedAnswer !== null && !isSubmitting

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with progress and settings */}
        <div className="flex items-center justify-between">
          <Button onClick={onExit} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Quiz
          </Button>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost"
              size="sm"
              aria-label="Toggle settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground">
              Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
            </div>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="timer-toggle" className="text-sm font-medium">
                  Enable Timer (30s per question)
                </Label>
                <Switch
                  id="timer-toggle"
                  checked={settings.timerEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, timerEnabled: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">{Math.round(progress)}% Complete</div>
        </div>

        {/* Timer */}
        {settings.timerEnabled && (
          <QuizTimer
            key={timerKey}
            duration={settings.questionTime}
            onTimeUp={handleTimeUp}
            isActive={!quizState.isCompleted && !isLoading}
          />
        )}

        {/* Question card */}
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={quizState.currentQuestionIndex + 1}
        />

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <div>Use number keys 1-4 to select answers</div>
          <div>Use arrow keys or Enter to navigate</div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={quizState.currentQuestionIndex === 0 || isSubmitting}
          >
            Previous
          </Button>

          <Button onClick={handleNext} disabled={!canProceed} className="min-w-24">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : quizState.currentQuestionIndex === quizState.questions.length - 1 ? (
              "Finish"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
