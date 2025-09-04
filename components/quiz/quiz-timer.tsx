"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface QuizTimerProps {
  duration: number // in seconds
  onTimeUp: () => void
  isActive: boolean
  onReset?: () => void
}

export function QuizTimer({ duration, onTimeUp, isActive, onReset }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (onReset) {
      setTimeLeft(duration)
    }
  }, [onReset, duration])

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, timeLeft, onTimeUp])

  const progress = ((duration - timeLeft) / duration) * 100
  const isLowTime = timeLeft <= 10

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Time Remaining</span>
        </div>
        <span className={`font-mono ${isLowTime ? "text-destructive" : "text-muted-foreground"}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </span>
      </div>
      <Progress value={progress} className={`h-2 ${isLowTime ? "bg-destructive/20" : ""}`} />
    </div>
  )
}
