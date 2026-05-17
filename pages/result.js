import Head from 'next/head'
import Link from 'next/link'

export default function Result() {
  return (
    <>
      <Head>
        <title>Retro Cricket Match Results</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8 md:py-12 px-4 relative overflow-y-auto overflow-x-hidden font-pixel text-white">
        {/* BEGIN: Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>
          <img 
            alt="Stadium Background" 
            className="w-full h-full object-cover object-center filter blur-[2px]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAov3BZqEAve2Pu31V98WGJ1aAxLkVA_JtYruKjh5b62gCy5lIg-CFaVwoqiyvOGnPMuNKUEX8ikEvJZK7u0GJMH2pXXz1IoKY0xbfxFWgzmpY_wX1iSgxy8hzvY1gJnr3h0qwzYXDEoeT7_VAXLERqpH9JqzOSEP5UgNQectKeIdqWBdG_S6EwL76So_XKxD6F6z7WJXo2Npx0DhGmd4ozTVf6sSEILZEso709jCfw_hMKda5KZZFqAsq2lFF0kkGrkCTuhyrbYBM4"
          />
        </div>
        {/* END: Background */}
        
        {/* BEGIN: Main Content */}
        <main className="relative z-20 w-full max-w-4xl my-auto">

          {/* BEGIN: Main Panel */}
          <div className="retro-panel p-6 md:p-8">
            {/* Corners */}
            <div className="retro-corner corner-tl"></div>
            <div className="retro-corner corner-tr"></div>
            <div className="retro-corner corner-bl"></div>
            <div className="retro-corner corner-br"></div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Col: Player Card & Stats */}
              <div className="w-full md:w-1/2 flex flex-col items-center space-y-6">
                {/* Player Card */}
                <div className="retro-card w-full max-w-sm rounded-lg overflow-hidden flex flex-col relative group animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-black text-white text-center py-2 text-2xl uppercase tracking-widest border-b-4 border-black">
                    Virat Kohli
                  </div>
                  <div className="h-64 bg-gray-300 relative overflow-hidden border-b-4 border-black">
                    <img 
                      alt="Virat Kohli Portrait" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcZ7Jov-zwi11ju4Jto02DL-BcSHlah5I76Yx3R0M6avSXw7RRX0pY7E4ZWz_zwkOlkPaIuLR0oMocLL2Lwq_ng_0qhMUprTNHWDmR5F7QhNEeRfLCdTDz-YkFHoNBbhnKyjScG3fkWuXiPUUc6Gef6YX3IAMyy7wIsMktUw3ijwr498UoCb58FQApHcXBr0IC6uITgmN6dLqV7aAyeOxZ1en8El4zYjyw4haZNtSdyuBLSuzLGjxHHdHU_C9SeubnmYS9n0HHnZwB"
                    />
                    {/* Decorative frame */}
                    <div className="absolute inset-0 border-[8px] border-yellow-400/30 pointer-events-none"></div>
                  </div>
                  <div className="bg-white p-4 flex justify-between items-center text-xl font-bold text-black">
                    <span>CLASS: BATSMAN</span>
                    <span>LVL: 99</span>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="w-full grid grid-cols-2 gap-4 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-white border-4 border-black p-2 shadow-[4px_4px_0_0_#000]">
                    <div className="text-gray-500 text-lg leading-none">MATCH</div>
                    <div className="text-3xl font-bold text-green-600">91%</div>
                  </div>
                  <div className="bg-white border-4 border-black p-2 shadow-[4px_4px_0_0_#000]">
                    <div className="text-gray-500 text-lg leading-none">QUESTIONS</div>
                    <div className="text-3xl font-bold text-blue-600">8</div>
                  </div>
                </div>
                
                {/* Journey */}
                <div className="w-full bg-black text-yellow-400 border-4 border-black p-2 text-center text-xl shadow-[4px_4px_0_0_#000] animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  POOL: 251 → 84 → 12 → <span className="text-white animate-pulse">1</span>
                </div>
              </div>
              
              {/* Right Col: Logic & Scoreboard */}
              <div className="w-full md:w-1/2 flex flex-col space-y-6">
                {/* Wooden Scoreboard (Secondary Panel) */}
                <div className="wooden-board p-4 text-center">
                  <h2 className="text-yellow-400 text-3xl mb-2 pixel-text">FINAL CONFIDENCE</h2>
                  <div className="text-5xl text-white font-bold pixel-text animate-bounce mt-2 animate-victory">
                    HIGH
                  </div>
                  <div className="mt-4 inline-block bg-black/50 text-white px-4 py-1 text-xl border-2 border-black">
                    MATCH COMPLETE
                  </div>
                </div>
                
                {/* AI Reasoning Log */}
                <div className="log-box flex-grow p-4 overflow-y-auto text-xl leading-relaxed shadow-[4px_4px_0_0_#000] flex flex-col min-h-[250px]">
                  <h3 className="text-white border-b-2 border-gray-600 mb-2 pb-1 uppercase tracking-wider">Battle Log:</h3>
                  <ul className="space-y-2 opacity-90">
                    <li className="animate-fade-in" style={{ animationDelay: '1s' }}>&gt; System engaged...</li>
                    <li className="animate-fade-in" style={{ animationDelay: '1.2s' }}>&gt; Filtering players...</li>
                    <li className="animate-fade-in" style={{ animationDelay: '1.4s' }}>&gt; <span className="text-white">Matched Indian batting profile</span></li>
                    <li className="animate-fade-in" style={{ animationDelay: '1.6s' }}>&gt; Narrowing down parameters...</li>
                    <li className="animate-fade-in" style={{ animationDelay: '1.8s' }}>&gt; <span className="text-white">Captaincy history detected</span></li>
                    <li className="animate-fade-in" style={{ animationDelay: '2.0s' }}>&gt; Aggressive playstyle confirmed</li>
                    <li className="animate-fade-in" style={{ animationDelay: '2.2s' }}>&gt; Target acquired!</li>
                  </ul>
                  <div className="mt-auto pt-4 text-yellow-400 animate-pulse typewriter" style={{ width: 'fit-content' }}>
                    _ awaiting input
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 border-t-4 border-gray-400 pt-6">
              <Link href="/question">
                <button className="retro-button px-6 py-3 text-2xl font-bold">PLAY AGAIN</button>
              </Link>
              <Link href="/">
                <button className="retro-button px-6 py-3 text-2xl font-bold bg-blue-400">NEW MATCH</button>
              </Link>
              <button className="retro-button px-6 py-3 text-2xl font-bold bg-green-400">VIEW ANALYSIS</button>
            </div>
          </div>
          {/* END: Main Panel */}
        </main>
      </div>
    </>
  )
}
