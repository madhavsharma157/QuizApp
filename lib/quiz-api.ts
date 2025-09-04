import type { Question } from "@/types/quiz"

// Fallback questions in case API fails
const fallbackQuestions: Question[] = [
  {
    id: "1",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "easy",
  },
  {
    id: "2",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy",
  },
  {
    id: "3",
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art",
    difficulty: "medium",
  },
  {
    id: "4",
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy",
  },
  {
    id: "5",
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    category: "History",
    difficulty: "medium",
  },
  {
    id: "6",
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "medium",
  },
  {
    id: "7",
    question: "Which Shakespeare play features the character Hamlet?",
    options: ["Romeo and Juliet", "Macbeth", "Hamlet", "Othello"],
    correctAnswer: 2,
    category: "Literature",
    difficulty: "easy",
  },
  {
    id: "8",
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Nauru", "Vatican City", "San Marino"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "hard",
  },
]

interface TriviaQuestion {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

interface TriviaResponse {
  response_code: number
  results: TriviaQuestion[]
}

export async function fetchQuizQuestions(amount = 8): Promise<Question[]> {
  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple&encode=url3986`)

    if (!response.ok) {
      throw new Error("Failed to fetch questions")
    }

    const data: TriviaResponse = await response.json()

    if (data.response_code !== 0 || !data.results.length) {
      throw new Error("No questions received")
    }

    return data.results.map((q, index) => {
      const options = [...q.incorrect_answers, q.correct_answer].map(decodeURIComponent).sort(() => Math.random() - 0.5) // Shuffle options

      const correctAnswer = options.indexOf(decodeURIComponent(q.correct_answer))

      return {
        id: `api-${index}`,
        question: decodeURIComponent(q.question),
        options,
        correctAnswer,
        category: decodeURIComponent(q.category),
        difficulty: q.difficulty as "easy" | "medium" | "hard",
      }
    })
  } catch (error) {
    console.warn("Failed to fetch questions from API, using fallback:", error)
    return fallbackQuestions.slice(0, amount)
  }
}
