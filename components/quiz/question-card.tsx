"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Question } from "@/types/quiz"
import { cn } from "@/lib/utils"

interface QuestionCardProps {
  question: Question
  selectedAnswer: number | null
  onAnswerSelect: (answerIndex: number) => void
  questionNumber: number
}

export function QuestionCard({ question, selectedAnswer, onAnswerSelect, questionNumber }: QuestionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            Question {questionNumber}
          </Badge>
          {question.category && (
            <Badge variant="outline" className="text-xs">
              {question.category}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl leading-relaxed text-balance">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3" role="radiogroup" aria-labelledby="question-title">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={cn(
                "h-auto p-4 text-left justify-start whitespace-normal text-wrap transition-all duration-200",
                selectedAnswer === index && "bg-secondary text-secondary-foreground",
                "hover:scale-[1.02] focus:scale-[1.02]",
              )}
              onClick={() => onAnswerSelect(index)}
              role="radio"
              aria-checked={selectedAnswer === index}
              aria-describedby={`option-${index}-desc`}
            >
              <span className="flex items-start gap-3 w-full">
                <span
                  className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-medium transition-colors",
                    selectedAnswer === index && "bg-secondary-foreground text-secondary",
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-sm leading-relaxed" id={`option-${index}-desc`}>
                  {option}
                </span>
              </span>
            </Button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className="text-xs text-muted-foreground text-center pt-2" aria-live="polite">
            Selected: Option {String.fromCharCode(65 + selectedAnswer)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
