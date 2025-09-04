"use client"

import { cn } from "@/lib/utils"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { QuizState, QuizResult } from "@/types/quiz"
import { Trophy, RotateCcw, Home, CheckCircle, XCircle, Star } from "lucide-react"

interface QuizResultsProps {
  quizState: QuizState
  onRestart: () => void
  onExit: () => void
}

interface HighScore {
  score: number
  total: number
  percentage: number
  date: string
  timeTaken: number
}

export function QuizResults({ quizState, onRestart, onExit }: QuizResultsProps) {
  const { questions, answers, score, startTime, endTime } = quizState
  const totalQuestions = questions.length
  const percentage = Math.round((score / totalQuestions) * 100)
  const timeTaken = endTime && startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0

  const [highScores, setHighScores] = useLocalStorage<HighScore[]>("quiz-high-scores", [])

  useEffect(() => {
    const newScore: HighScore = {
      score,
      total: totalQuestions,
      percentage,
      date: new Date().toLocaleDateString(),
      timeTaken,
    }

    setHighScores((prev) => {
      const updated = [...prev, newScore]
        .sort((a, b) => b.percentage - a.percentage || a.timeTaken - b.timeTaken)
        .slice(0, 5) // Keep top 5 scores
      return updated
    })
  }, [score, totalQuestions, percentage, timeTaken, setHighScores])

  const results: QuizResult[] = questions.map((question, index) => ({
    question: question.question,
    options: question.options,
    userAnswer: answers[index],
    correctAnswer: question.correctAnswer,
    isCorrect: answers[index] === question.correctAnswer,
  }))

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = () => {
    if (percentage >= 90) return "Excellent! Outstanding performance!"
    if (percentage >= 80) return "Great job! Well done!"
    if (percentage >= 70) return "Good work! Keep it up!"
    if (percentage >= 60) return "Not bad! Room for improvement."
    return "Keep practicing! You'll do better next time."
  }

  const isNewHighScore = highScores.length > 0 && percentage >= highScores[0].percentage

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Score Summary */}
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-secondary/10 rounded-full">
                {isNewHighScore ? (
                  <Star className="h-12 w-12 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Trophy className={`h-12 w-12 ${getScoreColor()}`} />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">{isNewHighScore ? "New High Score!" : "Quiz Complete!"}</CardTitle>
              <div className={`text-4xl font-bold ${getScoreColor()}`}>
                {score}/{totalQuestions}
              </div>
              <div className={`text-lg ${getScoreColor()}`}>{percentage}% Correct</div>
              <p className="text-muted-foreground">{getScoreMessage()}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-foreground">{timeTaken}s</div>
                <div className="text-muted-foreground">Time Taken</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">{totalQuestions - score}</div>
                <div className="text-muted-foreground">Incorrect</div>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={onRestart} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={onExit} variant="outline" className="flex-1 bg-transparent">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {highScores.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                High Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {highScores.map((highScore, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg",
                      index === 0 && isNewHighScore && "bg-yellow-50 border border-yellow-200",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <div>
                        <div className="font-medium">{highScore.percentage}%</div>
                        <div className="text-xs text-muted-foreground">{highScore.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {highScore.score}/{highScore.total}
                      </div>
                      <div className="text-xs text-muted-foreground">{highScore.timeTaken}s</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 transition-all hover:shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm leading-relaxed flex-1">
                    {index + 1}. {result.question}
                  </h3>
                  {result.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Your answer:</span>
                    <Badge variant={result.isCorrect ? "default" : "destructive"}>
                      {result.userAnswer !== null
                        ? `${String.fromCharCode(65 + result.userAnswer)} - ${result.options[result.userAnswer]}`
                        : "No answer selected"}
                    </Badge>
                  </div>

                  {!result.isCorrect && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Correct answer:</span>
                      <Badge variant="outline" className="border-green-600 text-green-600">
                        {String.fromCharCode(65 + result.correctAnswer)} - {result.options[result.correctAnswer]}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
