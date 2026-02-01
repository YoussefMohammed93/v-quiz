# 🎓 Vquiz: AI-Powered Learning Evolution

> **Transform any topic into interactive AI quizzes, flashcards, and study sessions instantly.**

Vquiz is a cutting-edge, chat-native learning platform that leverages AI to generate personalized study materials, analyze complex diagrams, and provide instant educational feedback. Built with a focus on **Visual Excellence** and **Seamless UX**, it's the future of interactive learning.

---

## ✨ Features

### 🧠 Intelligent Core

- **Chat-Native Quizzes**: Seamlessly generate and solve MCQs within a conversational interface.
- **Flashcards & True/False**: Master any subject with interactive flashcards and direct True/False challenges.
- **AI Memory**: The assistant remembers your context, allowing for deep follow-up questions and refined learning paths.
- **Smart Explanations**: Get detailed AI-generated explanations for every answer to help you deeply understand core concepts.

### 🎨 Premium Experience

- **Immersive Design**: A sleek dark-mode aesthetic featuring **Three.js** 3D particle systems.
- **Fluid Motion**: Ultra-smooth scrolling and interactions powered by **GSAP** and **Lenis**.
- **Responsive Mastery**: Fully optimized for mobile, tablet, and desktop experiences.
- **Real-time Sync**: Instant updates and chat persistence powered by **Convex**.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/), [Three.js](https://threejs.org/), & [Lenis](https://lenis.darkroom.engineering/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend & Infrastructure

- **Real-time Backend**: [Convex](https://convex.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **AI Engine**: Google Gemini (via Convex Actions)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- A [Convex](https://convex.dev/) account
- A [Clerk](https://clerk.com/) account
- A [Google AI (Gemini)](https://aistudio.google.com/) API key

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YoussefMohammed93/v-quiz.git
   cd v-quiz
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Clerk and Convex keys:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

4. **Initialize Convex:**

   ```bash
   npx convex dev
   ```

   _Follow the prompts to create a new project and add your `GOOGLE_API_KEY` to the Convex dashboard environment variables._

5. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🗺️ Roadmap

- [x] AI Conversational Memory
- [x] Responsive Chat Interface
- [x] GSAP/Three.js Animations
- [x] AI-Generated Study Flashcards & T/F
- [x] Real-time Database Integration (Convex)

---

## 📜 License

© 2026 Vquiz. Precision-engineered for modern learners.
