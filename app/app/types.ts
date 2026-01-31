import { Id } from "@/convex/_generated/dataModel";

export type Chat = {
  _id: Id<"chats">;
  userId: Id<"users">;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type MessageRole = "user" | "assistant";

export type QuizQuestion = {
  id: string;
  question: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correctKey: "A" | "B" | "C" | "D";
  userAnswer?: "A" | "B" | "C" | "D";
  explanation: string;
};

export type QuizBlock = {
  topic: string;
  questionCount: number;
  questions: QuizQuestion[];
};

export type QuizSummaryData = {
  correct: number;
  total: number;
  score: number;
  topic: string;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export type FlashcardBlock = {
  topic: string;
  count: number;
  cards: Flashcard[];
};

export type TrueFalseQuestion = {
  id: string;
  question: string;
  correctAnswer: boolean;
  userAnswer?: boolean;
  explanation: string;
};

export type TrueFalseQuizBlock = {
  topic: string;
  questionCount: number;
  questions: TrueFalseQuestion[];
};

export type Message = {
  _id: Id<"messages">;
  chatId: Id<"chats">;
  role: MessageRole;
  content: string;
  createdAt: number;
  quiz?: QuizBlock;
  flashcards?: FlashcardBlock;
  trueFalseQuiz?: TrueFalseQuizBlock;
  isStreaming?: boolean;
  isSummary?: boolean;
  summaryData?: QuizSummaryData;
  feedback?: {
    rating: "like" | "dislike";
    comment?: string;
  };
};
