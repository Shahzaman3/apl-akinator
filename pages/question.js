import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { useGameContext } from '../contexts/GameContext'

export default function Question() {
  const router = useRouter()
  const { 
    currentQuestion, questionNumber, remainingPlayers, confidence, 
    topPredictions, logs, isComplete, submitAnswer, loadingState 
  } = useGameContext()

  const [playerId, setPlayerId] = useState('')
  const logsEndRef = useRef(null)
  
  // Flash effect state
  const [isFlashing, setIsFlashing] = useState(false)
  const prevRemaining = useRef(remainingPlayers)

  useEffect(() => {
    if (remainingPlayers < prevRemaining.current) {
      setIsFlashing(true)
      setTimeout(() => setIsFlashing(false), 500)
    }
    prevRemaining.current = remainingPlayers
  }, [remainingPlayers])

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        router.push('/result')
      }, 1500)
    }
  }, [isComplete, router])

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  useEffect(() => {
    if (!currentQuestion && !loadingState && !isComplete) {
      router.push('/')
    }
  }, [currentQuestion, loadingState, isComplete, router])

  if (!currentQuestion) return null;

  const handleAnswer = async (answer) => {
    if (loadingState || isComplete) return;
    try {
      await submitAnswer(answer);
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <>
      <Head>
        <title>Cricket Masters</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div
        className="w-screen min-h-screen lg:h-screen flex items-center justify-center relative bg-gray-900 overflow-hidden select-none py-4 lg:py-0"
        style={{ fontFamily: "'VT323', monospace" }}
      >
        {/* BEGIN: Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Poke-Cricket Masters Background"
            className="w-full h-full object-cover select-none"
            src="/hero-bg.jpeg"
          />
        </div>
        {/* END: Background Layer */}

        {/* BEGIN: CRT Effect */}
        <div className="scanlines"></div>
        {/* END: CRT Effect */}

        {/* BEGIN: Animated Confetti Overlay (Optional conditional rendering based on convergence) */}
        {isComplete && (
          <div aria-hidden="true" className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="confetti bg-pink-500 top-[10%] left-[20%]" style={{ animationDelay: '0.2s' }}></div>
            <div className="confetti bg-green-500 top-[15%] left-[70%]" style={{ animationDelay: '0.7s' }}></div>
            <div className="confetti bg-yellow-400 top-[8%] left-[45%]" style={{ animationDelay: '1.1s' }}></div>
            <div className="confetti bg-blue-500 top-[25%] left-[80%]" style={{ animationDelay: '0.4s' }}></div>
            <div className="confetti bg-red-500 top-[5%] left-[85%]" style={{ animationDelay: '1.5s' }}></div>
            <div className="confetti bg-pink-500 top-[20%] left-[10%]" style={{ animationDelay: '0.9s' }}></div>
          </div>
        )}
        {/* END: Animated Confetti Overlay */}

        {/* BEGIN: Main UI Container */}
        <div className="relative z-20 w-[95%] max-w-7xl lg:h-[92vh] min-h-[500px] flex flex-col lg:flex-row items-stretch justify-center gap-4 lg:gap-6 py-4 lg:py-0">

          {/* BEGIN: Main Question Panel (LEFT/CENTER) */}
          <main className={`w-full lg:w-[65%] flex flex-col justify-center transition-opacity duration-300 ${isComplete ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="glass-panel w-full h-full p-3 md:p-5 flex flex-col relative rounded-sm">
              {/* Top Left/Right Flags Decoration */}
              <div className="absolute -top-8 left-4 flex gap-1 transform -rotate-12">
                <div className="w-6 h-8 bg-orange-500 border-2 border-black border-b-0"></div>
                <div className="w-6 h-8 bg-yellow-400 border-2 border-black border-b-0"></div>
                <div className="w-6 h-8 bg-orange-500 border-2 border-black border-b-0"></div>
              </div>
              <div className="absolute -top-8 right-16 flex gap-1 transform rotate-12">
                <div className="w-6 h-8 bg-red-500 border-2 border-black border-b-0"></div>
                <div className="w-6 h-8 bg-yellow-400 border-2 border-black border-b-0"></div>
                <div className="w-6 h-8 bg-orange-500 border-2 border-black border-b-0"></div>
              </div>

              {/* Header Title */}
              <header className="text-center mb-3 mt-2 relative z-10 flex flex-col items-center">
                <Link href="/" className="hover:scale-105 transition-transform duration-200">
                  <h1 className="text-white pixel-text text-5xl md:text-6xl lg:text-7xl tracking-wider uppercase leading-tight cursor-pointer">
                    Quiz Time
                  </h1>
                </Link>
              </header>

              {/* BEGIN: Content Area */}
              <section className="flex-grow flex flex-col items-center justify-center w-full px-2 md:px-6">
                {/* Question Header with Divider */}
                <div className="w-full flex items-center justify-center relative mb-3">
                  <div className="pokeball-dec -ml-6 z-10" style={{ left: 0 }}></div>
                  <div className="h-4 border-y-4 border-black w-full absolute top-1/2 -translate-y-1/2 bg-gray-400/50"></div>
                  <h2 className="pixel-text-gold text-3xl md:text-4xl px-4 relative z-10 bg-[#3a443a] border-4 border-black rounded-sm shadow-[inset_0_0_0_2px_#555]">
                    QUESTION {questionNumber}:
                  </h2>
                  <div className="pokeball-dec -mr-6 z-10" style={{ right: 0 }}></div>
                </div>

                {/* Question Box */}
                <div className={`w-[90%] bg-[#2a302a] border-4 border-black p-3 mb-5 text-center shadow-[inset_0_0_0_2px_#4a544a] rounded-sm transition-opacity ${loadingState ? 'opacity-50' : 'opacity-100'}`}>
                  <p className="text-white pixel-text text-2xl md:text-3xl uppercase tracking-wide">
                    {currentQuestion.text}
                  </p>
                </div>

                {/* BEGIN: Answer Grid */}
                <div className={`w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-10 md:gap-y-4 mb-4 ${loadingState ? 'pointer-events-none opacity-50' : ''}`}>
                  <button onClick={() => handleAnswer("NO")} className="btn-dark p-3 flex items-center gap-3 w-full rounded-sm group hover:bg-[#3a3a3a] transition-colors">
                    <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-black flex-shrink-0 shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform"></div>
                    <div className="flex items-baseline gap-2 text-left">
                      <span className="pixel-text-gold text-3xl">A.</span>
                      <span className="text-white pixel-text text-2xl uppercase">NO</span>
                    </div>
                  </button>

                  <button onClick={() => handleAnswer("YES")} className="btn-dark p-3 flex items-center gap-3 w-full rounded-sm group hover:bg-[#3a3a3a] transition-colors">
                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-black flex-shrink-0 shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform"></div>
                    <div className="flex items-baseline gap-2 text-left">
                      <span className="pixel-text-gold text-3xl">B.</span>
                      <span className="text-white pixel-text text-2xl uppercase">YES</span>
                    </div>
                  </button>

                  <button onClick={() => handleAnswer("MAYBE")} className="btn-dark p-3 flex items-center gap-3 w-full rounded-sm group hover:bg-[#3a3a3a] transition-colors">
                    <div className="w-6 h-6 rounded-full bg-pink-500 border-2 border-black flex-shrink-0 shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform"></div>
                    <div className="flex items-baseline gap-2 text-left">
                      <span className="pixel-text-gold text-3xl">C.</span>
                      <span className="text-white pixel-text text-2xl uppercase">MAYBE</span>
                    </div>
                  </button>

                  <button onClick={() => handleAnswer("DONT_KNOW")} className="btn-dark p-3 flex items-center gap-3 w-full rounded-sm group hover:bg-[#3a3a3a] transition-colors">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 border-2 border-black flex-shrink-0 shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform">
                      <div className="w-full h-full opacity-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#fff_2px,#fff_4px)]"></div>
                    </div>
                    <div className="flex items-baseline gap-2 text-left">
                      <span className="pixel-text-gold text-3xl">D.</span>
                      <span className="text-white pixel-text text-2xl uppercase">DON'T KNOW</span>
                    </div>
                  </button>
                </div>
                {/* END: Answer Grid */}
              </section>

              {/* BEGIN: Footer Framing */}
              <footer className="mt-auto w-full relative pt-5 pb-2 flex justify-center items-center">
                <div className="absolute bottom-6 w-[80%] h-4 border-y-4 border-black bg-gray-400/50 z-0"></div>
                <div className="pokeball-dec absolute bottom-[18px] left-[10%] z-10 bg-white">
                  <div style={{ width: '100%', height: '50%', background: '#fff', borderBottom: '3px solid #000', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', position: 'absolute', top: 0, left: 0 }}></div>
                </div>
                <div className="pokeball-dec absolute bottom-[18px] right-[10%] z-10 bg-white">
                  <div style={{ width: '100%', height: '50%', background: '#fff', borderBottom: '3px solid #000', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', position: 'absolute', top: 0, left: 0 }}></div>
                </div>

                <div className="relative z-20 flex items-center gap-3 bg-[#2a302a] px-4 py-2 border-4 border-black rounded-sm shadow-[inset_0_0_0_2px_#555]">
                  <label className="text-white pixel-text text-3xl uppercase tracking-wider" htmlFor="player-id">Player ID:</label>
                  <input
                    aria-label="Player ID"
                    className="pixel-input w-20 h-10 text-center text-2xl font-bold rounded-sm text-black"
                    id="player-id"
                    maxLength={3}
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                  />
                </div>
              </footer>
            </div>
          </main>

          {/* BEGIN: AI Thinking Log Panel (RIGHT) */}
          <aside className="w-full lg:w-[35%] flex flex-col">
            <div className={`glass-panel w-full h-full p-3 md:p-4 flex flex-col relative rounded-sm border-gray-400 transition-colors ${isComplete ? 'bg-green-900/80 border-green-400' : 'bg-black/70'}`}>
              
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-yellow-400 z-10"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-yellow-400 z-10"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-yellow-400 z-10"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-yellow-400 z-10"></div>

              <header className="text-center mb-4 pb-2 border-b-4 border-gray-600 relative mt-2">
                <h2 className={`pixel-text text-3xl md:text-4xl uppercase tracking-widest ${isComplete ? 'text-green-400 animate-pulse' : 'text-yellow-400 pulse-text'}`}>
                  {isComplete ? 'TARGET ACQUIRED' : 'AI THINKING LOG'}
                </h2>
                {!isComplete && (
                  <div className={`absolute top-1/2 right-2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-black ${loadingState ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
                )}
              </header>

              <div className={`grid grid-cols-2 gap-2 mb-2 transition-transform ${isFlashing ? 'scale-105' : 'scale-100'}`}>
                <div className="bg-[#1a201a] border-2 border-black p-2 flex flex-col items-center justify-center text-center shadow-[inset_0_0_0_1px_#333]">
                  <span className="text-gray-400 text-sm md:text-base uppercase">Question</span>
                  <span className="text-white text-3xl pixel-text">{questionNumber}</span>
                </div>
                <div className="bg-[#1a201a] border-2 border-black p-2 flex flex-col items-center justify-center text-center shadow-[inset_0_0_0_1px_#333]">
                  <span className="text-gray-400 text-sm md:text-base uppercase">Confidence</span>
                  <span className={`${confidence >= 75 ? 'text-green-400 animate-pulse' : 'text-green-400'} text-3xl pixel-text`}>
                    {Math.round(confidence)}%
                  </span>
                </div>
                <div className="bg-[#1a201a] border-2 border-black p-2 flex flex-col items-center justify-center text-center shadow-[inset_0_0_0_1px_#333]">
                  <span className="text-gray-400 text-sm md:text-base uppercase">Players Left</span>
                  <span className={`${isFlashing ? 'text-red-400' : 'text-yellow-400'} text-3xl pixel-text transition-colors`}>
                    {remainingPlayers}
                  </span>
                </div>
                <div className="bg-[#1a201a] border-2 border-black p-2 flex flex-col items-center justify-center text-center shadow-[inset_0_0_0_1px_#333]">
                  <span className="text-gray-400 text-sm md:text-base uppercase">AI Status</span>
                  <span className={`text-xl md:text-2xl pixel-text ${loadingState ? 'text-blue-400 animate-pulse' : isComplete ? 'text-green-400' : 'text-white'}`}>
                    {isComplete ? 'FINALIZING' : loadingState ? 'ANALYZING' : 'READY'}
                  </span>
                </div>
              </div>

              <div className="flex-grow bg-[#0a0a0a] border-4 border-black p-2 mb-3 rounded-sm shadow-[inset_0_0_0_2px_#333] overflow-y-auto relative min-h-[120px] md:min-h-[160px] flex flex-col">
                <ul className="space-y-2 text-lg md:text-xl text-green-400 opacity-90 font-mono tracking-tight mt-auto">
                  {logs.map((log, idx) => (
                    <li key={idx} className="animate-fade-in" style={{ color: log.type === 'system' ? 'white' : log.type === 'reduction' ? '#f87171' : '#4ade80' }}>
                      {log.text}
                    </li>
                  ))}
                  <div ref={logsEndRef} />
                  {loadingState && !isComplete && (
                    <li className="mt-2 text-yellow-400 typewriter" style={{ width: 'fit-content' }}>_</li>
                  )}
                </ul>
              </div>

              {/* Top Candidates */}
              <div className="bg-[#1a201a] border-4 border-black p-2 shadow-[inset_0_0_0_2px_#333] mt-auto">
                <h3 className="text-gray-400 border-b-2 border-gray-700 pb-1 mb-2 text-xl md:text-2xl uppercase tracking-wider text-center pixel-text">
                  TOP CANDIDATES
                </h3>
                <ul className="space-y-1">
                  {topPredictions.slice(0, 3).map((pred, i) => (
                    <li key={i} className="flex justify-between items-center text-xl md:text-2xl hover:bg-gray-800 px-2 py-1 transition-colors group cursor-default">
                      <span className={`pixel-text group-hover:text-yellow-300 ${i === 0 ? 'text-white' : i === 1 ? 'text-gray-300' : 'text-gray-400'}`}>
                        {i + 1}. {pred.name}
                      </span>
                      <span className={`pixel-text ${i === 0 ? 'text-green-400' : i === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {Math.round(pred.probability)}%
                      </span>
                    </li>
                  ))}
                  {topPredictions.length === 0 && !loadingState && (
                    <li className="text-gray-500 text-center pixel-text">Awaiting data...</li>
                  )}
                </ul>
              </div>

            </div>
          </aside>
          {/* END: AI Thinking Log Panel */}

        </div>
      </div>
    </>
  )
}

// Force server-side rendering to prevent static prerender crash (NextRouter not mounted)
export async function getServerSideProps() {
  return { props: {} }
}
