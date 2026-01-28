export type Chat = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
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

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  quiz?: QuizBlock;
  imageUrl?: string;
  isStreaming?: boolean;
  isSummary?: boolean;
  summaryData?: {
    correct: number;
    total: number;
    score: number;
    topic: string;
  };
};
