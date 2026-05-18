import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useGameContext } from '../contexts/GameContext'

export default function Home() {
  const router = useRouter()
  const { startGame } = useGameContext()
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = async () => {
    if (isStarting) return;
    setIsStarting(true);
    try {
      await startGame();
      // Only navigate after data is ready
      router.push('/question');
    } catch (error) {
      console.error('Failed to start game:', error);
      setIsStarting(false);
      alert(error.message || 'Failed to connect to AI scout. Please try again.');
    }
  }

  return (
    <>
      <Head>
        <title>Cricket Masters</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* BEGIN: Game Container */}
      <main className="relative w-screen h-[100dvh] min-h-[100dvh] bg-black overflow-hidden font-pixel text-white selection:bg-brand-titleFill selection:text-black">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full animate-fade-in opacity-0 select-none pointer-events-none" style={{ animationDelay: '0.2s' }}>
          <img
            alt="Pixel art cricket stadium background"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5chCnUIDVFarUYl_ZxrZRAYoouF_ImdWB4ngfllbHTni2E2iWYzn_X5bnxomZuw3-0u5edZj-KX8B7Y4IoRNNzKyZH9Hz1hY_9rb0GFHPjIVtD_kjer-gETEa5Zlete6HbysjXZOvqSH2iWlRZ4ZQRMpEperQxA7v_8SRRZwjhGkKNTsyAEL6DsB7b6ldiUZFx2UWXqm1i8eQiCl4bO0hj-x4NoibKs7ufOf5pgJUkcE8-CZCsAAaI0pcwO2lph3baHPpdA-q8qbN"
          />
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-6 sm:py-12 px-4 select-none">

          {/* BEGIN: Header Section */}
          <header className="flex flex-col items-center w-full animate-fade-in opacity-0 mb-6 sm:mb-12 md:mb-16 lg:mb-20" style={{ animationDelay: '0.5s' }}>
            {/* Title */}
            <h1 aria-label="Cricket Masters" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-titleFill pixel-text-shadow tracking-tight text-center leading-tight mb-2 drop-shadow-xl">
              CRICKET<br />MASTERS
            </h1>
            {/* Subtitle */}
            <div className="bg-black/80 px-4 py-2 border-2 border-white/20 mt-2 shadow-pixel-sm">
              <p className="text-xs sm:text-sm md:text-base text-white tracking-widest uppercase">
                AKINATOR!
              </p>
            </div>
          </header>
          {/* END: Header Section */}

          {/* BEGIN: Main Interactive Area */}
          <section
            onClick={handleStart}
            className={`relative w-[95%] max-w-5xl h-20 sm:h-24 md:h-32 lg:h-40 min-h-[80px] bg-brand-panelBg border-[4px] sm:border-[6px] border-brand-panelBorder shadow-pixel flex items-center justify-center rounded-sm animate-scale-in opacity-0 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${isStarting ? 'animate-pulse pointer-events-none' : ''}`}
            style={{ animationDelay: '0.8s' }}
          >
            {/* Corner Decorations (Simulated Pokeballs) */}
            <div className="absolute -top-4 -left-4 w-8 h-8 sm:-top-5 sm:-left-5 sm:w-10 sm:h-10 md:-top-6 md:-left-6 md:w-12 md:h-12 bg-white rounded-full border-[3px] sm:border-4 border-black overflow-hidden flex flex-col shadow-pixel-sm z-20 pointer-events-none select-none">
              <div className="h-1/2 bg-red-600 border-b-[3px] sm:border-b-4 border-black w-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-4 sm:h-4 bg-white border-[3px] sm:border-4 border-black rounded-full"></div>
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 sm:-top-5 sm:-right-5 sm:w-10 sm:h-10 md:-top-6 md:-right-6 md:w-12 md:h-12 bg-white rounded-full border-[3px] sm:border-4 border-black overflow-hidden flex flex-col shadow-pixel-sm z-20 pointer-events-none select-none">
              <div className="h-1/2 bg-red-600 border-b-[3px] sm:border-b-4 border-black w-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-4 sm:h-4 bg-white border-[3px] sm:border-4 border-black rounded-full"></div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 sm:-bottom-5 sm:-left-5 sm:w-10 sm:h-10 md:-bottom-6 md:-left-6 md:w-12 md:h-12 bg-white rounded-full border-[3px] sm:border-4 border-black overflow-hidden flex flex-col shadow-pixel-sm z-20 pointer-events-none select-none">
              <div className="h-1/2 bg-red-600 border-b-[3px] sm:border-b-4 border-black w-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-4 sm:h-4 bg-white border-[3px] sm:border-4 border-black rounded-full"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 sm:-bottom-5 sm:-right-5 sm:w-10 sm:h-10 md:-bottom-6 md:-right-6 md:w-12 md:h-12 bg-white rounded-full border-[3px] sm:border-4 border-black overflow-hidden flex flex-col shadow-pixel-sm z-20 pointer-events-none select-none">
              <div className="h-1/2 bg-red-600 border-b-[3px] sm:border-b-4 border-black w-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-4 sm:h-4 bg-white border-[3px] sm:border-4 border-black rounded-full"></div>
            </div>

            {/* Start Button Area */}
            <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
              {isStarting ? (
                <h2 className="text-sm sm:text-lg md:text-2xl lg:text-3xl text-yellow-400 pixel-text-shadow tracking-widest animate-pulse text-center">
                  INITIALIZING AI SCOUT...
                </h2>
              ) : (
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-white pixel-text-shadow tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em] flex gap-2 sm:gap-4 md:gap-8 justify-center items-center">
                  <span>START</span>
                  <span>GAME</span>
                </h2>
              )}
            </div>
          </section>
          {/* END: Main Interactive Area */}

          {/* BEGIN: Footer Prompt */}
          <footer className="animate-fade-in opacity-0 mt-6 sm:mt-10 md:mt-14" style={{ animationDelay: '1.2s' }}>
            <div className="animate-float">
              <p className="text-base sm:text-xl md:text-3xl text-brand-startText pixel-text-shadow animate-pulse tracking-[0.1em]">
                PRESS START
              </p>
            </div>
          </footer>
          {/* END: Footer Prompt */}

        </div>
      </main>
      {/* END: Game Container */}
    </>
  )
}

// Force server-side rendering to prevent static prerender crash (NextRouter not mounted)
export async function getServerSideProps() {
  return { props: {} }
}
