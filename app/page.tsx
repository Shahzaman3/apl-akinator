"use client";

import { useEffect } from "react";
import TopNavBar from "@/components/TopNavBar";
import Link from "next/link";
import { appSession } from "@/lib/navigationState";

export default function Home() {
  useEffect(() => {
    // Explicitly authorize client route navigation sessions starting from root hub
    appSession.isClientNavigated = true;
  }, []);

  return (
    <>
      <TopNavBar />
      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-lg flex flex-col gap-xl">
        {/* Hero Section */}
        <section className="relative w-full rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low min-h-[500px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Hero Background"
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdn6-5ta6O4WwGp27CzPJOSk24wSbH3C56r9C-TQwIKd-c2-jEP3ytf28BxrXGmkiC-uzHihPAbdzBFxn5ykZaWX_1RJ9qBHxb-oNVcYiyI5mG6UU9uXxGHPP_fBCYnwh70mEnw5e-3IINKJvZPw5EkSOtPB5b8tIw5EpXaBcviHXkZuz2sKzWDsTtscyUo1UwGOR_rFyIcdnvF6YIKhZ5FyNxbl0M3g5wkEaGBoR1cbLsQndiKUPYX-hZCbTFQw74xRTffm3CkFU"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
          </div>
          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-3xl px-4 sm:pl-lg md:pl-xl py-xl flex flex-col gap-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-high border border-outline-variant w-max">
              <span className="material-symbols-outlined text-primary text-sm">
                smart_toy
              </span>
              <span className="font-label-xs sm:font-label-sm text-label-xs sm:text-label-sm text-primary uppercase tracking-wider">
                AI Powered Engine
              </span>
            </div>
            <h1 className="font-headline-lg md:font-display-lg text-headline-lg md:text-display-lg text-on-surface">
              Test Your Cricket IQ Against Our{" "}
              <span className="text-primary italic">Neural Network</span>.
            </h1>
            <p className="font-body-md sm:font-body-lg text-body-md sm:text-body-lg text-on-surface-variant max-w-2xl mt-sm">
              Analyze stats, decode player trajectories, and identify legends from
              blurred visuals or cryptic data points. The ultimate challenge for
              professional cricket analysts.
            </p>
            <div className="mt-lg flex flex-col sm:flex-row flex-wrap gap-md">
              <Link
                href="/game"
                className="bg-primary-container text-on-primary-container px-8 py-4 sm:py-3 rounded hover:bg-primary hover:text-background transition-colors font-label-md text-label-md uppercase tracking-wide inline-flex items-center justify-center w-full sm:w-auto"
              >
                Start Game
              </Link>
            </div>
          </div>
        </section>

        {/* Intelligence Mechanics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Filtering Card */}
          <div className="bg-surface-container border border-outline-variant rounded-lg p-lg flex flex-col gap-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
              <span className="material-symbols-outlined text-[120px]">
                memory
              </span>
            </div>
            <div className="flex items-center gap-sm border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-primary">
                psychology
              </span>
              <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                Neural Filtering
              </h3>
            </div>
            <p className="font-body-sm text-on-surface-variant mt-sm">
              Real-time deduction logs trace exactly how our engine isolates players through multi-layered weighted parameters.
            </p>
          </div>

          {/* Pool Card */}
          <div className="bg-surface-container border border-outline-variant rounded-lg p-lg flex flex-col gap-md">
            <div className="flex items-center gap-sm border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-primary">
                group_remove
              </span>
              <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                Live Reduction
              </h3>
            </div>
            <p className="font-body-sm text-on-surface-variant mt-sm">
              Watch the dynamic player pool instantly collapse as answers filter out improbable candidates automatically.
            </p>
          </div>

          {/* Confidence Card */}
          <div className="bg-surface-container border border-outline-variant rounded-lg p-lg flex flex-col gap-md">
            <div className="flex items-center gap-sm border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-primary">
                speed
              </span>
              <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                Confidence Scoring
              </h3>
            </div>
            <p className="font-body-sm text-on-surface-variant mt-sm">
              Every inference updates the engine&apos;s internal certainty probability index before offering a definitive answer.
            </p>
          </div>
        </section>
      </main>
      {/* Simple Footer */}
      <footer className="border-t border-outline-variant bg-surface mt-auto py-lg text-center">
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          © 2026 CRIC-AI AKINATOR. MADE BY TEAM CRYPTONIAN.
        </p>
      </footer>
    </>
  );
}
