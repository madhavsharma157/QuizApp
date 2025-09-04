export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category?: string
  difficulty?: "easy" | "medium" | "hard"
}

export interface QuizState {
  questions: Question[]
  currentQuestionIndex: number
  answers: (number | null)[]
  score: number
  isCompleted: boolean
  startTime: Date
  endTime?: Date
}

export interface QuizResult {
  question: string
  options: string[]
  userAnswer: number | null
  correctAnswer: number
  isCorrect: boolean
}
