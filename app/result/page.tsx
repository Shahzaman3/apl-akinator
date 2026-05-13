"use client";

import { useState, useEffect } from "react";
import TopNavBar from "@/components/TopNavBar";
import SideNavBar from "@/components/SideNavBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerProfile } from "@/types";
import { apiService } from "@/services/apiService";
import { appSession } from "@/lib/navigationState";

export default function ResultScreen() {
  const router = useRouter();



  const [isRevealed, setIsRevealed] = useState(false);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    // Fetch actual deduction outcomes from REST endpoint
    const fetchPayload = async () => {
      try {
        const data = await apiService.getPredictionResult();
        setProfile(data);
        
        // Only schedule dramatic reveal AFTER payload successfully loads
        setTimeout(() => {
          setIsRevealed(true);
        }, 1500);
      } catch (e) {
        console.error("Failed retrieving final intelligence bio:", e);
        // Graceful dynamic redirection if session trace is invalid
        router.replace("/");
      }
    };
    fetchPayload();
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavBar />
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden w-full max-w-container-max mx-auto">
        <SideNavBar />
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-lg flex justify-center items-start relative">
          <div className="w-full max-w-[1000px] flex flex-col gap-lg">
            
            <AnimatePresence mode="wait">
              {!isRevealed || !profile ? (
                <motion.div
                  key="decrypting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-lg w-full relative z-10"
                >
                  {/* Absolute Center Spinner Overlay over the skeleton */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                    <div className="w-28 h-28 relative flex items-center justify-center mb-6 bg-background/80 p-4 rounded-full backdrop-blur border border-outline-variant shadow-2xl">
                      <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
                      <div className="absolute inset-2 rounded-full border-b-2 border-secondary animate-spin-reverse"></div>
                      <span className="material-symbols-outlined text-3xl text-on-surface pulse-anim">psychology</span>
                    </div>
                    <div className="bg-background/90 px-6 py-2 rounded-full backdrop-blur border border-outline-variant flex flex-col items-center">
                      <h2 className="font-label-md text-label-md text-primary tracking-widest uppercase animate-pulse">
                        Decrypting Telemetry
                      </h2>
                      <span className="font-label-xs text-label-xs text-on-surface-variant font-mono mt-0.5">
                        ESTIMATING MATCH &gt; 95%
                      </span>
                    </div>
                  </div>

                  {/* Skeleton Layout Canvas underneath */}
                  <div className="flex flex-col items-center justify-center gap-3 mb-md opacity-40 pointer-events-none">
                    <div className="w-48 h-6 bg-surface-container-high rounded-full animate-pulse"></div>
                    <div className="w-72 h-10 bg-surface-container-high rounded-lg animate-pulse"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-md opacity-40 pointer-events-none">
                    {/* Skeleton Profile Card */}
                    <div className="md:col-span-5 bg-surface-container border border-outline-variant/30 rounded-xl min-h-[350px] p-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="w-16 h-12 bg-surface-container-high rounded-lg animate-pulse"></div>
                      <div className="flex flex-col gap-3 mt-auto">
                        <div className="w-2/3 h-8 bg-surface-container-high rounded animate-pulse"></div>
                        <div className="flex gap-2">
                          <div className="w-20 h-6 bg-surface-container-high rounded animate-pulse"></div>
                          <div className="w-28 h-6 bg-surface-container-high rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Skeleton Stats */}
                    <div className="md:col-span-7 flex flex-col gap-md">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                        <div className="h-28 bg-surface-container rounded-xl p-5 flex flex-col justify-between animate-pulse border border-outline-variant/30"></div>
                        <div className="h-28 bg-surface-container rounded-xl p-5 flex flex-col justify-between animate-pulse border border-outline-variant/30"></div>
                      </div>
                      <div className="flex-1 bg-surface-container rounded-xl p-6 animate-pulse border border-outline-variant/30 min-h-[200px]"></div>
                    </div>
                  </div>
                </motion.div>
              ) : profile ? (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, staggerChildren: 0.1 }}
                  className="flex flex-col gap-lg w-full"
                >
                  {/* Header Section */}
                  <div className="flex flex-col items-center justify-center text-center mb-md">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                      className="inline-flex items-center justify-center bg-surface-container-high border border-outline-variant rounded-full px-4 py-1 mb-md"
                    >
                      <span className="w-2 h-2 rounded-full bg-secondary-container mr-2 pulse-anim"></span>
                      <span className="font-label-sm text-label-sm text-on-surface tracking-wider uppercase">
                        AI Analysis Complete
                      </span>
                    </motion.div>
                    <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">
                      Prediction Match Found
                    </h1>
                  </div>

                  {/* Core Result Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
                    {/* Large Player Profile Card (Spans 12 cols on mobile, 5 on desktop) */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                      className="md:col-span-5 bg-[#161B22] border border-[#21262D] rounded-xl p-6 flex flex-col relative overflow-hidden group shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-[#161B22]/80 to-transparent z-10"></div>
                      <img
                        alt="Predicted Cricket Player"
                        className="absolute top-0 right-0 w-[150%] h-[150%] object-cover object-top opacity-30 mix-blend-luminosity group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 -translate-y-10"
                        src={profile.imageUrl}
                      />
                      <div className="relative z-20 flex-1 flex flex-col justify-end h-full min-h-[350px]">
                        <div className="flex justify-between items-start mb-auto">
                          <div className="bg-[#21262D]/80 backdrop-blur border border-primary/30 rounded-lg p-3 text-center shadow-[0_0_15px_rgba(26,115,232,0.15)]">
                            <span className="block font-stats-xl text-stats-xl text-primary leading-none">
                              {profile.confidence}%
                            </span>
                            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-widest mt-1 block">
                              AI Confidence
                            </span>
                          </div>
                        </div>

                        <div className="mt-8">
                          <h3 className="font-display-md text-display-md text-on-surface leading-tight font-black uppercase tracking-tight">
                            {profile.name}
                          </h3>
                          
                          <div className="flex flex-wrap gap-2 mt-4">
                            <span className="bg-[#21262D] text-on-surface font-label-xs text-label-xs px-3 py-1.5 rounded border border-outline-variant flex items-center gap-1.5 uppercase tracking-wider">
                              <span className="material-symbols-outlined text-[16px] text-primary">public</span>
                              {profile.country}
                            </span>
                            <span className="bg-[#21262D] text-on-surface font-label-xs text-label-xs px-3 py-1.5 rounded border border-outline-variant flex items-center gap-1.5 uppercase tracking-wider">
                              <span className="material-symbols-outlined text-[16px] text-secondary">sports_cricket</span>
                              {profile.role}
                            </span>
                          </div>
                          
                          <div className="flex gap-2 mt-2">
                            <span className="bg-primary-container/20 text-primary font-label-xs text-label-xs px-3 py-1.5 rounded border border-primary/30 flex items-center gap-1.5 uppercase tracking-wider">
                              <span className="material-symbols-outlined text-[16px]">shield</span>
                              {profile.team}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Statistics & Analytics Cards (Spans 7 cols on desktop) */}
                    <div className="md:col-span-7 flex flex-col gap-md">
                      {/* Top Stat Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                          className="bg-[#161B22] border border-[#21262D] rounded-xl p-5 flex flex-col justify-center"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                              Mock Match Accuracy
                            </p>
                            <span className="material-symbols-outlined text-tertiary">analytics</span>
                          </div>
                          <p className="font-stats-xl text-stats-xl text-on-surface">
                            {profile.matchAccuracy}%
                          </p>
                          <div className="w-full bg-[#21262D] h-1.5 mt-3 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} animate={{ width: `${profile.matchAccuracy}%` }} transition={{ delay: 1, duration: 1 }}
                              className="bg-tertiary h-full"
                            ></motion.div>
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                          className="bg-[#161B22] border border-[#21262D] rounded-xl p-5 flex flex-col justify-center relative overflow-hidden"
                        >
                          <div className="absolute right-[-10px] top-[-10px] opacity-5">
                            <span className="material-symbols-outlined text-[100px]">military_tech</span>
                          </div>
                          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                            Career Runs (T20I)
                          </p>
                          <p className="font-stats-xl text-stats-xl text-on-surface">
                            {profile.careerRuns}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-primary">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            <span className="font-label-sm text-label-sm font-bold">Top 1% Global Tier</span>
                          </div>
                        </motion.div>
                      </div>

                      {/* Mock Analytics Report */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        className="bg-[#161B22] border border-[#21262D] rounded-xl p-6 flex-1 flex flex-col"
                      >
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#21262D]">
                          <span className="material-symbols-outlined text-primary text-xl">dataset</span>
                          <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                            Intelligence Report Summary
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 flex-1">
                          <div className="flex flex-col gap-1">
                            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-widest">Playing Style Match</span>
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              <span className="font-body-md text-body-md text-on-surface">{profile.playingStyle}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-widest">Key Strength</span>
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              <span className="font-body-md text-body-md text-on-surface">{profile.keyStrength}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-widest">Era Generation</span>
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              <span className="font-body-md text-body-md text-on-surface">{profile.eraGeneration}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-widest">Signature Metric</span>
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                              <span className="font-body-md text-body-md text-on-surface">{profile.signatureMetric}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-[#21262D] bg-[#0B0E14] -mx-6 -mb-6 px-6 py-4 rounded-b-xl flex items-center justify-between">
                          <span className="font-label-xs text-label-xs text-on-surface-variant font-mono">
                            SESSION ID: {profile.sessionId}
                          </span>
                          <span className="font-label-xs text-label-xs text-primary font-mono flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            VERIFIED MATCH
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Action Area */}
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="flex justify-center mt-xl mb-xl"
                  >
                    <Link
                      href="/game"
                      className="bg-primary-container text-on-primary-container font-label-md text-label-md uppercase tracking-widest px-8 py-4 rounded flex items-center gap-3 hover:bg-inverse-primary hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-surface-tint shadow-[0_0_20px_rgba(26,115,232,0.4)]"
                    >
                      <span className="material-symbols-outlined">restart_alt</span>
                      RUN NEW PREDICTION
                    </Link>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            
          </div>
        </main>
      </div>
    </div>
  );
}
