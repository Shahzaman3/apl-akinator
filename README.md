<div align="center">
  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtuqDlPl8gPrErC47Ylai52wAi-4lgOLZP1XDXEQc6KsOAGIDV_Q8wcatzAyvX1yyB-ZoyzzgeuLqBiQR1aG3mtNQFyy7kObc1d7MgDX6kkkRRZ-OJEeauRqDfsMD4eBDPlSA4jKsdyd4qYbUcG1Cspsk6KXyy_UE8SxKElsmgolRSU8EXKJGf-EqFfzHrWaje7t2DyrnYwZCbARcQt4k51WCXwNroww1TzrCpl5LJnSKuEpEz9t4T_p3wz_GdDlQt5IYisVz9cH8" alt="CricIntel Logo" width="100" height="100" style="border-radius: 50%; border: 2px solid #1a73e8;" />

  # CricIntel
  ### AI-Powered IPL Intelligence & Player Guessing Engine

  [![Next.js](https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-F05A89?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
  [![Vercel Ready](https://img.shields.io/badge/Vercel-Deployed-white?style=for-the-badge&logo=vercel)](https://vercel.com)

  *Test your analytical instincts against an adaptive, sports-data-driven neural model.*
</div>

---

## 🏏 Hero Description

**CricIntel** is a highly immersive, Akinator-inspired visual deduction dashboard built exclusively for professional cricket analysts and Indian Premier League (IPL) enthusiasts. 

Instead of traditional generic guessing games, CricIntel mirrors real-world analytical software interfaces. Players respond to adaptive binary/soft-weighted constraints while the dashboard provides complete transparency into the engine's real-time **Neural Filtering**, **Dynamic Pool Reduction**, and **Probabilistic Confidence Scoring**.

---

## ✨ Key Features

- **🧠 Adaptive Deductive Logic:** Evaluates answer weights statefully to iteratively isolate candidates from a massive pre-indexed player database.
- **📊 Real-time Telemetry Monitor:** Tracks session progress, current inference probability loops, and remaining dataset scales instantly within an immersive side panel.
- **⚡ Neural Filtering Log:** Traces execution pipelines with absolute transparency, tracing attribute confirmation gains step-by-step.
- **🏆 Premium Dashboard Aesthetics:** Outfitted with custom deep-dark palettes, sleek Framer Motion keyframe animations, and sports-analytics-inspired typography.
- **🤝 Backend & AI Integration Ready:** Fully scaffolded service abstractions optimized for future connection to active live statistics databases and **Google Gemini AI** explanation streams.

---

## 🛠️ Tech Stack

- **Core Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation Layer:** [Framer Motion](https://www.framer.com/motion/)
- **UI Architecture Layer:** Custom Atomic Design primitives inspired by `shadcn/ui`
- **Future AI Engine Layer:** Planned integration pipelines for the **Google Gemini API**

---

## 🏛️ Architecture Overview

The repository enforces clean separation of concerns, decoupling presentational canvases from underlying simulated data pipelines to facilitate painless future API replacements.

```markdown
/a:/projects/apl-demo
├── app/
│   ├── game/
│   │   └── page.tsx     # Core Guessing Engine Loop & Telemetry Router Hub
│   ├── result/
│   │   └── page.tsx     # Verified Prediction Reveal & Analytics Summary View
│   ├── layout.tsx       # Standard App Shell Canvas
│   ├── page.tsx         # Dedicated Immersive Portal & Feature Mechanics Hub
│   └── template.tsx     # Route Switch Keyframe Stabilizer
├── components/
│   ├── SideNavBar.tsx   # Integrated Telemetry HUD Monitor
│   ├── TopNavBar.tsx    # Responsive Desktop/Mobile Header
│   └── ui/              # Dedicated Directory for Modular Base Components
├── data/
│   └── mockData.ts      # Offline Static Domain Dictionaries
├── services/
│   └── apiService.ts    # Decoupled Async Simulation Layer (Easily maps to REST endpoints)
├── styles/
│   └── globals.css      # Consolidated Core Utility Layer
└── types/
    └── index.ts         # Unified Domain Interface Types
```

---

## 📸 Interface Preview

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Home Arena</b></td>
      <td align="center"><b>Live Telemetry & Game Arena</b></td>
    </tr>
    <tr>
      <td><img src="https://placehold.co/600x350/0b0e14/1a73e8?text=Home+Screen+Mockup" alt="Home Screen Placeholder" /></td>
      <td><img src="https://placehold.co/600x350/0b0e14/ff5722?text=Game+Screen+Mockup" alt="Game Screen Placeholder" /></td>
    </tr>
    <tr>
      <td align="center"><b>Decryption Overlay</b></td>
      <td align="center"><b>Verified Outcome Panel</b></td>
    </tr>
    <tr>
      <td><img src="https://placehold.co/600x350/0b0e14/38b2ac?text=Decrypting+State+Mockup" alt="Decrypting State Placeholder" /></td>
      <td><img src="https://placehold.co/600x350/0b0e14/1a73e8?text=Result+Screen+Mockup" alt="Result Screen Placeholder" /></td>
    </tr>
  </table>
</div>

---

## 🚀 Installation & Local Development

Getting up and running locally is extremely straightforward. Ensure you have Node.js (v18+) and a local MongoDB instance installed.

```bash
# 1. Clone the repository
git clone https://github.com/your-org/cricintel.git
cd cricintel

# 2. Install dependencies cleanly
npm install

# 3. Setup Environment Variables
cp .env.example .env

# Configure MONGODB_URI and GEMINI_API_KEY in .env

# 4. Seed Initial Player Database
# Run this via Curl or Postman to bootstrap the ~150+ players:
curl -X POST http://localhost:3000/api/db/seed

# 5. Launch the local development engine
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the platform.

---

## 🌍 Production Deployment & MongoDB Atlas Setup

### 1. Database Configuration
Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas):
1. Deploy a free `M0` cluster.
2. Add a Database User and record the credentials.
3. Whitelist `0.0.0.0/0` (or your hosting provider IPs) in the Network Access.
4. Retrieve the Connection String (URI) replacing `<password>` with your user password and selecting database `apl`.

### 2. Vercel Compatibility
This project is fully optimized for Vercel:
1. Link the repository in the Vercel Dashboard.
2. Go to Environment Variables and supply:
   - `MONGODB_URI` = `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/apl`
   - `GEMINI_API_KEY` = `AIzaSy...` (from Google AI Studio)
3. Trigger deployment.
4. After initial deployment completes, execute a one-time `POST` to your production URL at `https://your-app.vercel.app/api/db/seed` to populate production dataset candidates.

---
<div align="center">
  <p><b>Made with absolute dedication by Team Cryptonian.</b></p>
</div>
