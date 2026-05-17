import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Question() {
  const [playerId, setPlayerId] = useState('1')

  return (
    <>
      <Head>
        <title>Retro Quiz UI - Poké-Cricket Masters</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div 
        className="w-screen h-screen flex items-center justify-center relative bg-gray-900 overflow-hidden select-none"
        style={{ fontFamily: "'VT323', monospace" }}
      >
        {/* BEGIN: Background Layer */}
        <div className="absolute inset-0 z-0">
          {/* Using the provided image as the exact background */}
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
        
        {/* BEGIN: Animated Confetti Overlay */}
        <div aria-hidden="true" className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="confetti bg-pink-500 top-[10%] left-[20%]" style={{ animationDelay: '0.2s' }}></div>
          <div className="confetti bg-green-500 top-[15%] left-[70%]" style={{ animationDelay: '0.7s' }}></div>
          <div className="confetti bg-yellow-400 top-[8%] left-[45%]" style={{ animationDelay: '1.1s' }}></div>
          <div className="confetti bg-blue-500 top-[25%] left-[80%]" style={{ animationDelay: '0.4s' }}></div>
          <div className="confetti bg-red-500 top-[5%] left-[85%]" style={{ animationDelay: '1.5s' }}></div>
          <div className="confetti bg-pink-500 top-[20%] left-[10%]" style={{ animationDelay: '0.9s' }}></div>
        </div>
        {/* END: Animated Confetti Overlay */}
        
        {/* BEGIN: Main UI Container */}
        <main className="relative z-20 w-[90%] md:w-[65%] max-w-4xl h-auto min-h-[500px] flex flex-col items-center justify-center">
          {/* BEGIN: Glass Panel */}
          <div className="glass-panel w-full h-full p-4 md:p-8 flex flex-col relative rounded-sm">
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
            <header className="text-center mb-6 mt-4 relative z-10 flex flex-col items-center">
              <Link href="/" className="hover:scale-105 transition-transform duration-200">
                <h1 className="text-white pixel-text text-5xl md:text-6xl lg:text-7xl tracking-wider uppercase leading-tight cursor-pointer">
                  Quiz Time &amp; Player Stats
                </h1>
              </Link>
            </header>
            
            {/* BEGIN: Content Area */}
            <section className="flex-grow flex flex-col items-center w-full px-2 md:px-8">
              {/* Question Header with Divider */}
              <div className="w-full flex items-center justify-center relative mb-4">
                {/* Pokeball left */}
                <div className="pokeball-dec -ml-6 z-10" style={{ left: 0 }}></div>
                {/* Lines */}
                <div className="h-4 border-y-4 border-black w-full absolute top-1/2 -translate-y-1/2 bg-gray-400/50"></div>
                {/* Title text over lines */}
                <h2 className="pixel-text-gold text-3xl md:text-4xl px-4 relative z-10 bg-[#3a443a] border-4 border-black rounded-sm shadow-[inset_0_0_0_2px_#555]">
                  QUESTION OF THE MATCH:
                </h2>
                {/* Pokeball right */}
                <div className="pokeball-dec -mr-6 z-10" style={{ right: 0 }}></div>
              </div>
              
              {/* Question Box */}
              <div className="w-[90%] bg-[#2a302a] border-4 border-black p-4 mb-8 text-center shadow-[inset_0_0_0_2px_#4a544a] rounded-sm">
                <p className="text-white pixel-text text-2xl md:text-3xl uppercase tracking-wide">
                  Which type of ball was used?
                </p>
              </div>
              
              {/* BEGIN: Answer Grid */}
              <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-12 md:gap-y-6 mb-8">
                {/* Option A */}
                <button className="btn-dark p-3 flex items-center gap-3 w-full rounded-sm group hover:bg-[#3a3a3a]">
                  <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-black flex-shrink-0 shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform"></div>
                  <div className="flex items-baseline gap-2 text-left">
                    <span className="pixel-text-gold text-3xl">A.</span>
                    <span className="text-white pixel-text text-2xl uppercase">Red Kookaburra</span>
                  </div>
                </button>
                
                {/* Option B */}
                <button className="btn-dark p-3 flex items-center gap-3 w-full rounded-sm group hover:bg-[#3a3a3a]">
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-black flex-shrink-0 shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform"></div>
                  <div className="flex items-baseline gap-2 text-left">
                    <span className="pixel-text-gold text-3xl">B.</span>
                    <span className="text-white pixel-text text-2xl uppercase">White Dukes</span>
                  </div>
                </button>
                
                {/* Option C */}
                <button className="btn-dark p-3 flex items-center gap-3 w-full rounded-sm group hover:bg-[#3a3a3a]">
                  <div className="w-6 h-6 rounded-full bg-pink-500 border-2 border-black flex-shrink-0 shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform"></div>
                  <div className="flex items-baseline gap-2 text-left">
                    <span className="pixel-text-gold text-3xl">C.</span>
                    <span className="text-white pixel-text text-2xl uppercase">Pink S.G.</span>
                  </div>
                </button>
                
                {/* Option D */}
                <button className="btn-dark p-3 flex items-center gap-3 w-full rounded-sm group hover:bg-[#3a3a3a]">
                  <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 border-2 border-black flex-shrink-0 shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform">
                    <div className="w-full h-full opacity-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#fff_2px,#fff_4px)]"></div>
                  </div>
                  <div className="flex items-baseline gap-2 text-left">
                    <span className="pixel-text-gold text-3xl">D.</span>
                    <span className="text-white pixel-text text-2xl uppercase">Other</span>
                  </div>
                </button>
              </div>
              {/* END: Answer Grid */}
            </section>
            {/* END: Content Area */}
            
            {/* BEGIN: Footer Framing */}
            <footer className="mt-auto w-full relative pt-8 pb-4 flex justify-center items-center">
              {/* Connecting Frame Lines */}
              <div className="absolute bottom-6 w-[80%] h-4 border-y-4 border-black bg-gray-400/50 z-0"></div>
              
              {/* Corner Pokeballs */}
              <div className="pokeball-dec absolute bottom-[18px] left-[10%] z-10 bg-white">
                <div style={{ width: '100%', height: '50%', background: '#fff', borderBottom: '3px solid #000', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', position: 'absolute', top: 0, left: 0 }}></div>
              </div>
              <div className="pokeball-dec absolute bottom-[18px] right-[10%] z-10 bg-white">
                <div style={{ width: '100%', height: '50%', background: '#fff', borderBottom: '3px solid #000', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', position: 'absolute', top: 0, left: 0 }}></div>
              </div>
              
              {/* Player ID Input Area */}
              <div className="relative z-20 flex items-center gap-3 bg-[#2a302a] px-4 py-2 border-4 border-black rounded-sm shadow-[inset_0_0_0_2px_#555]">
                <label className="text-white pixel-text text-3xl uppercase tracking-wider" htmlFor="player-id">Player ID:</label>
                <input 
                  aria-label="Player ID" 
                  className="pixel-input w-20 h-10 text-center text-2xl font-bold rounded-sm" 
                  id="player-id" 
                  maxLength={3} 
                  type="text" 
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                />
              </div>
            </footer>
            {/* END: Footer Framing */}
          </div>
          {/* END: Glass Panel */}
        </main>
        {/* END: Main UI Container */}
      </div>
    </>
  )
}
