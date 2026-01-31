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

export type Message = {
  _id: Id<"messages">;
  chatId: Id<"chats">;
  role: MessageRole;
  content: string;
  createdAt: number;
  quiz?: QuizBlock;
  flashcards?: FlashcardBlock;
  isStreaming?: boolean;
  isSummary?: boolean;
  summaryData?: QuizSummaryData;
};
