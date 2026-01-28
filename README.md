# Vquiz

**AI-powered quiz and chat app for modern learners.**

Vquiz transforms any topic into interactive AI quizzes. Built with Next.js 16, Convex, Clerk, GSAP, and Three.js, it offers a seamless, chat-native learning experience.

## 🚀 Features

- **Chat-Native Quizzes**: Generate and answer multiple-choice questions (MCQs) directly within a familiar chat interface.
- **Image Analysis**: Upload images (diagrams, code snippets) for AI-driven question generation and explanations.
- **Instant Feedback**: Real-time "Correct/Wrong" feedback with detailed explanations for every answer.
- **Progress Tracking**: Secure history of all chats and quiz attempts.
- **Premium Design**: Immersive dark-mode aesthetic with 3D particles and smooth GSAP scroll animations.
- **Flexible Pricing**: Free tier included, with affordable upgrade options for power users.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [Convex](https://convex.dev/)
- **Auth**: [Clerk](https://clerk.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/) & [Three.js](https://threejs.org/)
- **Styling**: Tailwind CSS & Vanilla CSS variables
- **Deployment**: Vercel (Recommended)

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: React components (UI, 3D scenes, sections).
- `lib/`: Utility functions and shared helpers.
- `public/`: Static assets (fonts, images).

## 🔮 Roadmap / Sections

The landing page features the following sections:

1. **Hero**: Interactive 3D particle system with "Start for free" CTA.
2. **How Vquiz Works**: 3-step guide (Ask, Get MCQs, Learn).
3. **Features**: Highlights of chat, image support, and smart explanations.
4. **Learning Journey**: Horizontal scroll storytelling "Your learning flow".
5. **Benefits**: User testimonials and value proposition.
6. **Pricing**: Free, Basic ($1.99), and Pro ($4.99) plans.
7. **FAQ**: Common questions about limits, security, and features.

## 📦 Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/v-quiz.git
   cd v-quiz
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file and add your keys for Convex and Clerk:

   ```env
   CONVEX_DEPLOYMENT=...
   NEXT_PUBLIC_CONVEX_URL=...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open the app**:
   Visit [http://localhost:3000](http://localhost:3000) to see Vquiz in action.

## 📜 License

© Vquiz 2026. All rights reserved.
