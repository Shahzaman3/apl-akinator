"use client";

import { useState, useEffect } from "react";
import TopNavBar from "@/components/TopNavBar";
import SideNavBar from "@/components/SideNavBar";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

import { AnswerType, Question, ReasoningLog } from "@/types";
import { apiService } from "@/services/apiService";
import { appSession } from "@/lib/navigationState";

function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(value, { bounce: 0, duration: 800 });
  const display = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export default function GameScreen() {
  const router = useRouter();



  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [confidence, setConfidence] = useState(12);
  const [remainingPool, setRemainingPool] = useState(150);
  const [likelyCandidates, setLikelyCandidates] = useState<string[]>([]);
  const [logs, setLogs] = useState<ReasoningLog[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    // Initialize direct game session from REST endpoint
    const setupGame = async () => {
      setIsThinking(true);
      const data = await apiService.getInitialGame();
      setCurrentQuestion(data.firstQuestion);
      setRemainingPool(data.initialPool);
      setConfidence(data.initialConfidence);
      setIsThinking(false);
    };
    setupGame();
  }, []);

  const handleAnswer = async (answerInput: string) => {
    if (isThinking) return;
    const answer = answerInput as AnswerType;
    
    setIsThinking(true);
    
    // Stage 1: Immediate reaction log
    setLogs((prev) => [
      {
        filter: answer === "YES" ? "Confirmed attribute presence." : answer === "NO" ? "Excluding non-matching profiles." : "Applying soft probability weights.",
        reduction: "Analyzing database...",
        type: "memory",
      },
      ...prev,
    ]);

    // Stage 2: Intermediate processing log
    const timer = setTimeout(() => {
      setLogs((prev) => {
        const newLogs = [...prev];
        if (newLogs[0]) {
          newLogs[0] = {
            filter: "Information gain evaluated. Calculating optimal next query.",
            reduction: "Confidence increasing...",
            type: "settings",
          };
        }
        return newLogs;
      });
    }, 700);
    
    if (!currentQuestion) return;

    // Stage 3: Await active deduction from REST API backend
    const response = await apiService.submitAnswer(currentQuestion.id, answer);
    clearTimeout(timer);

    if (!response.isComplete && response.nextQuestion) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentQuestion(response.nextQuestion);
      setConfidence(response.confidence);
      setRemainingPool(response.remainingPool);
      if (response.topCandidates) {
        setLikelyCandidates(response.topCandidates);
      }
      
      setLogs((prev) => {
        const pastLogs = prev.slice(1); // Remove intermediate processing log
        return [...response.logs, ...pastLogs];
      });
      
      setIsThinking(false);
    } else {
      // Integration complete, move to outcome validation
      router.push("/result");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavBar />
      <div className="flex flex-1 max-w-container-max mx-auto w-full">
        <SideNavBar 
          gameState={{
            questionsAnswered: currentIndex,
            confidence: confidence,
            remainingPool: remainingPool
          }}
        />
        {/* Main Content Area */}
        <main className="flex-1 p-lg flex flex-col gap-md h-[calc(100vh-64px)] overflow-y-auto">
          {/* Header & Progress */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-md mb-sm">
            <div>
              <h1 className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-on-surface">
                Guess the Player
              </h1>
              <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface-variant mt-1">
                Question {currentIndex + 1} of 8 • Level:{" "}
                <span className="text-secondary">Hard</span>
              </p>
            </div>
            <div className="bg-surface-container card-border rounded-lg p-3 md:p-md flex items-center justify-between w-full lg:w-auto gap-4 md:gap-lg">
              <div className="flex flex-col items-center">
                <span className="font-label-xs md:font-label-sm text-label-xs md:text-label-sm text-on-surface-variant uppercase text-center">
                  Remaining
                </span>
                <span className="font-stats-xl text-stats-xl text-primary flex items-center gap-1">
                  <AnimatedCounter value={remainingPool} />
                </span>
              </div>
              <div className="h-10 border-l border-outline-variant"></div>
              <div className="flex flex-col items-center flex-1 lg:flex-none">
                <span className="font-label-xs md:font-label-sm text-label-xs md:text-label-sm text-on-surface-variant uppercase">
                  AI Confidence
                </span>
                <div className="flex items-center gap-2 mt-1 w-full justify-center">
                  <div className="w-20 md:w-32 bg-surface-container-highest rounded-full h-2 overflow-hidden relative">
                    <motion.div
                      className="bg-tertiary h-full absolute left-0 top-0"
                      initial={{ width: "78%" }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <span className="font-label-md text-label-md text-tertiary w-10">
                    <AnimatedCounter value={confidence} />%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Arena Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-md flex-1">
            {/* Central Play Area (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-md">
              {/* Question Card Container */}
              <div className="h-[300px] md:h-[400px] relative rounded-xl overflow-hidden card-border bg-[#161B22]">
                <AnimatePresence mode="wait">
                  {isThinking ? (
                    <motion.div
                      key="thinking"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-xl text-center"
                    >
                      <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                          backgroundImage: "radial-gradient(circle at 50% 50%, #ff5722 0%, transparent 50%)",
                        }}
                      ></div>
                      <div className="z-10 flex flex-col items-center gap-md">
                        <div className="w-12 h-12 rounded-full border-4 border-surface-variant border-t-primary animate-spin"></div>
                        <h2 className="font-headline-md text-headline-md text-on-surface mt-4 animate-pulse">
                          Neural Net Processing...
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          Filtering player database
                        </p>
                      </div>
                    </motion.div>
                  ) : !currentQuestion ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <motion.div
                      key={`question-${currentQuestion.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-xl text-center"
                    >
                      <div
                        className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 50% 50%, #1a73e8 0%, transparent 50%)",
                        }}
                      ></div>
                      <div className="z-10 flex flex-col items-center gap-4 md:gap-lg max-w-2xl px-2 h-full justify-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 border-2 border-primary text-primary font-bold text-xl md:text-2xl shadow-[0_0_15px_rgba(26,115,232,0.2)] tracking-tight"
                      >
                        Q{currentIndex + 1}
                      </motion.div>
                      <h2 className="font-headline-lg md:font-display-lg text-headline-lg md:text-display-lg text-on-surface leading-tight px-2">
                        {currentQuestion.text}
                      </h2>
                      <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant mt-2 px-2">
                        {currentQuestion.subtitle}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 md:gap-md h-24 md:h-32 mt-2 md:mt-0">
                <motion.button
                  whileHover={!isThinking ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isThinking ? { scale: 0.98 } : {}}
                  disabled={isThinking}
                  onClick={() => handleAnswer("NO")}
                  className={`bg-surface-container hover:bg-surface-container-high card-border rounded-lg flex flex-col items-center justify-center gap-1 md:gap-sm transition-colors border-b-4 border-b-error active:border-b-0 active:translate-y-1 ${
                    isThinking ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-error text-[24px] md:text-[32px]"
                  >
                    close
                  </span>
                  <span className="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md text-on-surface">
                    NO
                  </span>
                </motion.button>
                <motion.button
                  whileHover={!isThinking ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isThinking ? { scale: 0.98 } : {}}
                  disabled={isThinking}
                  onClick={() => handleAnswer("MAYBE")}
                  className={`bg-surface-container hover:bg-surface-container-high card-border rounded-lg flex flex-col items-center justify-center gap-1 md:gap-sm transition-colors border-b-4 border-b-outline active:border-b-0 active:translate-y-1 ${
                    isThinking ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-on-surface-variant text-[24px] md:text-[32px]"
                  >
                    help
                  </span>
                  <span className="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md text-on-surface">
                    MAYBE
                  </span>
                </motion.button>
                <motion.button
                  whileHover={!isThinking ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isThinking ? { scale: 0.98 } : {}}
                  disabled={isThinking}
                  onClick={() => handleAnswer("YES")}
                  className={`bg-primary-container hover:bg-primary-container/90 rounded-lg flex flex-col items-center justify-center gap-1 md:gap-sm transition-colors shadow-lg active:translate-y-1 ${
                    isThinking ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-on-primary-container text-[24px] md:text-[32px]"
                  >
                    check
                  </span>
                  <span className="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md text-on-primary-container">
                    YES
                  </span>
                </motion.button>
              </div>
            </div>

            {/* AI Reasoning Panel (4 cols) */}
            <div className="lg:col-span-4 bg-[#161B22] card-border rounded-xl flex flex-col h-[400px] lg:h-[544px] mt-4 lg:mt-0">
              <div className="p-md border-b border-[#21262D] flex items-center gap-sm">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  psychology
                </span>
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">
                  AI Reasoning Log
                </h3>
              </div>
              <div className="p-md flex-1 overflow-y-auto flex flex-col gap-md">
                <AnimatePresence initial={false}>
                  {logs.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center text-center p-8 my-auto"
                    >
                      <span className="material-symbols-outlined text-3xl mb-2 text-on-surface-variant animate-pulse">
                        psychology_alt
                      </span>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Awaiting telemetry...
                      </p>
                      <p className="font-body-xs text-xs text-on-surface-variant/60 mt-1 max-w-[200px]">
                        The engine will log probabilistic deductions here after your first answer.
                      </p>
                    </motion.div>
                  )}
                  {logs.map((log, index) => (
                    <motion.div
                      key={log.filter + index}
                      initial={{ opacity: 0, height: 0, scale: 0.9, marginBottom: 0 }}
                      animate={{ opacity: 1 - index * 0.2, height: "auto", scale: 1, marginBottom: 16 }}
                      className={`bg-[#21262D] rounded-lg p-sm border-l-2 overflow-hidden ${
                        index === 0 ? "border-primary" : "border-outline-variant"
                      } flex gap-sm origin-top shrink-0`}
                    >
                      <span className={`material-symbols-outlined mt-1 text-sm ${index === 0 ? "text-primary" : "text-on-surface-variant"}`}>
                        {log.type}
                      </span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                          Filter Applied
                        </p>
                        <p className="font-body-md text-body-md text-on-surface">
                          {log.filter}
                        </p>
                        <p className="font-label-sm text-label-sm text-secondary mt-1">
                          {log.reduction}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Elimination Tracker */}
              <div className="p-md border-t border-[#21262D] bg-[#0B0E14] m-sm rounded border">
                <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">
                  Likely Candidates
                </h4>
                <div className="flex flex-wrap gap-xs">
                  {likelyCandidates.length > 0 ? (
                    likelyCandidates.map((name, i) => (
                      <span key={i} className="px-2 py-1 bg-[#21262D] rounded font-label-sm text-label-sm text-on-surface">
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-1 bg-[#21262D]/50 rounded font-label-sm text-label-sm text-on-surface-variant">
                      Awaiting filters...
                    </span>
                  )}
                  {likelyCandidates.length > 0 && remainingPool > likelyCandidates.length && (
                    <span className="px-2 py-1 bg-[#21262D] rounded font-label-sm text-label-sm text-on-surface-variant">
                      + <AnimatedCounter value={Math.max(0, remainingPool - likelyCandidates.length)} /> more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
