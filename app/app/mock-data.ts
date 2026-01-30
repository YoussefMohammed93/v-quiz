import type { Chat, Message } from "./types";
import type { Id } from "@/convex/_generated/dataModel";

export const mockChats: Chat[] = [
  {
    _id: "chat-1" as unknown as Id<"chats">,
    userId: "user-1" as unknown as Id<"users">,
    title: "React Hooks Deep Dive",
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 60 * 1000,
  },
  {
    _id: "chat-2" as unknown as Id<"chats">,
    userId: "user-1" as unknown as Id<"users">,
    title: "TypeScript Advanced Types",
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 60 * 60 * 1000,
  },
  {
    _id: "chat-3" as unknown as Id<"chats">,
    userId: "user-1" as unknown as Id<"users">,
    title: "CSS Grid vs Flexbox",
    createdAt: Date.now() - 48 * 60 * 60 * 1000,
    updatedAt: Date.now() - 24 * 60 * 60 * 1000,
  },
];

export const mockMessages: Record<string, Message[]> = {
  "chat-1": [
    {
      _id: "msg-1" as unknown as Id<"messages">,
      chatId: "chat-1" as unknown as Id<"chats">,
      role: "user",
      content: "Can you explain React Hooks to me?",
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      _id: "msg-2" as unknown as Id<"messages">,
      chatId: "chat-1" as unknown as Id<"chats">,
      role: "assistant",
      content:
        "React Hooks are functions that let you use state and other React features in functional components. The most common hooks are useState for managing state, useEffect for side effects, and useContext for accessing context values. They were introduced in React 16.8 to make it easier to reuse stateful logic without writing class components.",
      createdAt: Date.now() - 2 * 60 * 60 * 1000 + 30000,
    },
    {
      _id: "msg-3" as unknown as Id<"messages">,
      chatId: "chat-1" as unknown as Id<"chats">,
      role: "user",
      content: "Generate 3 MCQs about React Hooks",
      createdAt: Date.now() - 1 * 60 * 60 * 1000,
    },
    {
      _id: "msg-4" as unknown as Id<"messages">,
      chatId: "chat-1" as unknown as Id<"chats">,
      role: "assistant",
      content: "Here's a quiz to test your understanding of React Hooks:",
      createdAt: Date.now() - 1 * 60 * 60 * 1000 + 10000,
      quiz: {
        topic: "React Hooks Fundamentals",
        questionCount: 3,
        questions: [
          {
            id: "q1",
            question: "What is the primary purpose of the useState Hook?",
            options: [
              { key: "A", text: "To manage component lifecycle" },
              { key: "B", text: "To add state to functional components" },
              { key: "C", text: "To fetch data from APIs" },
              { key: "D", text: "To handle routing in React" },
            ],
            correctKey: "B",
            explanation:
              "useState is specifically designed to add state management to functional components. It returns a state value and a function to update it.",
          },
          {
            id: "q2",
            question: "When does the useEffect Hook run by default?",
            options: [
              { key: "A", text: "Only on component mount" },
              { key: "B", text: "Only on component unmount" },
              { key: "C", text: "After every render" },
              { key: "D", text: "Before the first render" },
            ],
            correctKey: "C",
            explanation:
              "By default, useEffect runs after every render, including the first render. You can control when it runs by passing a dependency array as the second argument.",
          },
          {
            id: "q3",
            question: "Which rule must be followed when using React Hooks?",
            options: [
              { key: "A", text: "Hooks can be called inside loops" },
              { key: "B", text: "Hooks must be called at the top level" },
              { key: "C", text: "Hooks can be called conditionally" },
              { key: "D", text: "Hooks must be called in class components" },
            ],
            correctKey: "B",
            explanation:
              "Hooks must always be called at the top level of a React function, not inside loops, conditions, or nested functions. This ensures that Hooks are called in the same order on every render.",
          },
        ],
      },
    },
  ],
  "chat-2": [
    {
      _id: "msg-5" as unknown as Id<"messages">,
      chatId: "chat-2" as unknown as Id<"chats">,
      role: "user",
      content: "What are utility types in TypeScript?",
      createdAt: Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      _id: "msg-6" as unknown as Id<"messages">,
      chatId: "chat-2" as unknown as Id<"chats">,
      role: "assistant",
      content:
        "TypeScript provides several utility types to facilitate common type transformations. Some popular ones include:\n\n• Partial<T> - Makes all properties optional\n• Required<T> - Makes all properties required\n• Pick<T, K> - Selects specific properties\n• Omit<T, K> - Excludes specific properties\n• Record<K, T> - Creates an object type with keys K and values T",
      createdAt: Date.now() - 24 * 60 * 60 * 1000 + 20000,
    },
  ],
  "chat-3": [
    {
      _id: "msg-7" as unknown as Id<"messages">,
      chatId: "chat-3" as unknown as Id<"chats">,
      role: "user",
      content: "When should I use CSS Grid over Flexbox?",
      createdAt: Date.now() - 48 * 60 * 60 * 1000,
    },
    {
      _id: "msg-8" as unknown as Id<"messages">,
      chatId: "chat-3" as unknown as Id<"chats">,
      role: "assistant",
      content:
        "Great question! Here's a simple guideline:\n\n**Use CSS Grid when:**\n• You need a 2D layout (rows AND columns)\n• You want to control both axes simultaneously\n• You're building complex page layouts\n• You need to overlap elements\n\n**Use Flexbox when:**\n• You need a 1D layout (either row OR column)\n• You want items to wrap naturally\n• You're aligning items in a container\n• You need simple component layouts\n\nIn practice, you'll often use both together - Grid for page structure, Flexbox for component internals!",
      createdAt: Date.now() - 48 * 60 * 60 * 1000 + 45000,
    },
  ],
};
