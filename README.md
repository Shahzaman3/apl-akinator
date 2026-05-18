<div align="center">
  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtuqDlPl8gPrErC47Ylai52wAi-4lgOLZP1XDXEQc6KsOAGIDV_Q8wcatzAyvX1yyB-ZoyzzgeuLqBiQR1aG3mtNQFyy7kObc1d7MgDX6kkkRRZ-OJEeauRqDfsMD4eBDPlSA4jKsdyd4qYbUcG1Cspsk6KXyy_UE8SxKElsmgolRSU8EXKJGf-EqFfzHrWaje7t2DyrnYwZCbARcQt4k51WCXwNroww1TzrCpl5LJnSKuEpEz9t4T_p3wz_GdDlQt5IYisVz9cH8" alt="CricIntel Logo" width="100" height="100" style="border-radius: 50%; border: 2px solid #1a73e8;" />

  # CricIntel
  ### Production-Grade AI-Powered IPL Bayesian Deduction & Intelligence Engine

  [![Next.js](https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

  [![Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Flash-orange?style=for-the-badge&logo=google-gemini)](https://aistudio.google.com/)

  *A state-of-the-art Akinator-inspired IPL player prediction dashboard, powered by dynamic Bayesian Inference, Shannon Entropy maximization, and Google Gemini Generative AI.*
</div>

---

## 🏏 Hero Overview

**CricIntel** is an elite, analytics-focused visual deduction platform engineered exclusively for Indian Premier League (IPL) enthusiasts. Unlike traditional hardcoded branching tree trivia, CricIntel employs an advanced **Bayesian Probability Engine** that operates on real-time probability distributions across **600 historic and modern IPL players**. 

The dashboard mirrors actual data science command screens, visualizing conditional entropy updates, sequential filtering logs, and instantaneous player pool collapses as the predictive engine isolates the target player in under 8-10 moves.

---

## 🧠 Architecture & Scientific Core

### 1. Mathematical Deduction Loop
*   **Shannon Conditional Entropy**: During each cycle, the engine calculates information gains $IG(T, Q) = H(T) - H(T|Q)$ for all unasked questions against active player priors. It dynamically chooses the question offering the maximum theoretical variance split.
*   **Soft Bayesian Updating**: Answer evaluations incorporate noise tolerance scaling ($YES/NO$ mapped at $0.95/0.05$, $MAYBE$ at $0.60/0.40$), preventing accidental user errors from prematurely collapsing the distribution.
*   **Immersive Suspense Floor**: A strict, user-mandated minimum floor of **8 questions** ensures a fully paced Akinator-style build-up before offering verified prediction outcomes.

### 2. Performance Supercharging
*   **RAM static dataset caching**: Static player reference records are loaded from MongoDB into application heap memory on server boot using `.lean()` objects, bypassing expensive disk reads and making calculations virtually **instantaneous (< 0.5ms)**.
*   **Windows IPv4 Resolution Bypass**: Configured database connection URIs to directly reference `127.0.0.1` loopback addresses, completely eliminating the 2-second IPv6 fallback delay commonly experienced in dual-stack Windows environments.

---

## 🛠️ Comprehensive Tech Stack

- **Core Framework**: Next.js 14 (Unified App Router Architecture for Seamless API/UI)
- **State Persistence**: MongoDB & Mongoose ODM (Connection pooling optimized)
- **AI Coprocessor**: Google Gemini 1.5 Flash API (Generates real-time intelligence briefs)
- **Interface Aesthetics**: Tailwind CSS with Custom CSS Variables & Atomic Typography
- **Visual Interactivity**: Framer Motion physics-based spring animations

---

## 🚀 Easy Deployment & Operation

### 💻 Native System Startup

Ensure a local `mongodb` service is running on port `27017` before initiating.

```bash
# 1. Install standard packages
npm install

# 2. Provision environment overrides (Setup MONGO & GEMINI)
cp .env.example .env

# 3. Boot Next.js in explicit port-bound development mode
npm run dev -- -p 3333
```

---

### 🏏 Critical Last Step: Database Seeding
When initially installing the repository, the database collection will be empty. CricIntel features a frictionless, one-click browser hydration utility to populate **600 professional players** automatically:

👉 Open your browser and navigate once to: **`http://localhost:3333/api/db/seed`**

A confirmation JSON message will display, signifying the static reference pool is fully populated and the server-side RAM cache has successfully synchronized!

---

## 🤖 Artificial Intelligence Feature Map

Upon completing active mathematical deduction trails, CricIntel's result pipeline bridges directly with the **Google Gemini Flash** large language model:
1. Extracts peak mathematical player candidates.
2. Maps player context and unique statistics directly to AI inference prompts.
3. Streams robotic, hyper-analytical **1-Sentence Intelligence Reports** (e.g., *"Execution algorithm successfully isolated: Virat Kohli displays dominant top-order anchor metrics."*) directly onto the final dashboard.

*(Elegant placeholders will automatically trigger in dev environments lacking active `GEMINI_API_KEY` variables).*

---

## 🏛️ Repository Directory Schema

```markdown
├── app/
│   ├── api/              # Unified backend API router handlers
│   │   ├── db/seed/      # Direct Browser-based database hydration controller
│   │   └── game/         # Bayesian probability update, answer, & outcome handlers
│   ├── game/page.tsx     # Immersive play arena with live AI telemetry HUD
│   ├── result/page.tsx   # Generative AI prediction result summary board
│   └── layout.tsx        # Global CSS fonts & layout wrapper
├── components/
│   └── SideNavBar.tsx    # Real-time confidence & remaining counter tracker
├── lib/
│   ├── entropy.ts        # Core Shannon Entropy & Information Gain calculators
│   ├── filterPlayers.ts  # Multi-attribute soft Bayesian weighted update calculations
│   ├── gemini.ts         # Google Generative AI pipeline & backup generators
│   └── mongodb.ts        # Database pooling & high-speed memory cache managers
├── models/               # High-fidelity Mongoose schema definitions
└── data/players.json     # Pre-indexed canonical 600-player reference database
```

---

<div align="center">
  <p><b>Engineered with absolute technical excellence by Team Cryptonian.</b></p>
</div>
