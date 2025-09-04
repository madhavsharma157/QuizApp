"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Quiz } from "@/components/quiz/quiz"
import { Brain, Play, Trophy } from "lucide-react"

export default function HomePage() {
  const [showQuiz, setShowQuiz] = useState(false)

  if (showQuiz) {
    return <Quiz onExit={() => setShowQuiz(false)} />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-secondary/10 rounded-full">
              <Brain className="h-12 w-12 text-secondary" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Quiz Master</h1>
            <p className="text-muted-foreground text-balance">
              Test your knowledge with our interactive quiz featuring questions from various categories
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-secondary" />
              Ready to Challenge Yourself?
            </CardTitle>
            <CardDescription>Answer 8 multiple-choice questions and see how well you score!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="font-semibold text-foreground">8</div>
                <div>Questions</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">Mixed</div>
                <div>Categories</div>
              </div>
            </div>
            <Button onClick={() => setShowQuiz(true)} className="w-full" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
