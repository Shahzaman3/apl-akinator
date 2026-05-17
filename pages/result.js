import Head from 'next/head'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useGameContext } from '../contexts/GameContext'
import { getResult } from '../services/gameApi'

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop";

export default function Result() {
  const router = useRouter()
  const { gameId, questionNumber, clearGameSession } = useGameContext()
  const [resultData, setResultData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isImageReady, setIsImageReady] = useState(false)

  useEffect(() => {
    if (!gameId) {
      router.push('/')
      return;
    }

    const fetchResult = async () => {
      try {
        const data = await getResult(gameId);
        
        // Preload Image System
        const imgUrl = data?.prediction?.imageUrl || FALLBACK_IMAGE;
        const img = new window.Image();
        img.src = imgUrl;
        
        img.onload = () => {
          data.prediction.imageUrl = imgUrl;
          setResultData(data);
          setIsLoading(false);
          // Small delay before triggering animations ensures DOM is ready
          setTimeout(() => setIsImageReady(true), 50);
        };
        
        img.onerror = () => {
          console.warn("Failed to load prediction image, falling back to silhouette.");
          data.prediction.imageUrl = FALLBACK_IMAGE;
          setResultData(data);
          setIsLoading(false);
          setTimeout(() => setIsImageReady(true), 50);
        };

      } catch (err) {
        setError('Failed to retrieve final prediction from AI Scout.');
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [gameId, router]);

  const handleNewMatch = () => {
    clearGameSession();
    router.push('/');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center font-pixel text-white">
        <h1 className="text-4xl animate-pulse text-yellow-400 tracking-widest text-center">AI FINALIZING<br/>PREDICTION...</h1>
      </div>
    )
  }

  if (error || !resultData) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center font-pixel text-white">
        <h1 className="text-4xl text-red-500 mb-8">{error || "CRITICAL ERROR"}</h1>
        <button onClick={handleNewMatch} className="retro-button px-6 py-3 text-2xl font-bold bg-blue-400">REBOOT SYSTEM</button>
      </div>
    )
  }

  const { prediction } = resultData;

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
        {isImageReady && (
          <main className="relative z-20 w-full max-w-4xl my-auto animate-fade-in">
            {/* White flash transition effect */}
            <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-flash"></div>

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
                    <div className="bg-black text-white text-center py-2 text-xl md:text-2xl uppercase tracking-widest border-b-4 border-black">
                      {prediction.name}
                    </div>
                    <div className="h-64 bg-gray-300 relative overflow-hidden border-b-4 border-black">
                      <NextImage 
                        src={prediction.imageUrl}
                        alt={`${prediction.name} Portrait`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 384px"
                        priority
                      />
                      {/* Decorative frame */}
                      <div className="absolute inset-0 border-[8px] border-yellow-400/30 pointer-events-none z-10"></div>
                    </div>
                    <div className="bg-white p-4 flex justify-between items-center text-lg md:text-xl font-bold text-black uppercase">
                      <span className="truncate mr-2">CLASS: {prediction.role}</span>
                      <span>LVL: 99</span>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="w-full grid grid-cols-2 gap-4 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-white border-4 border-black p-2 shadow-[4px_4px_0_0_#000]">
                      <div className="text-gray-500 text-lg leading-none">MATCH</div>
                      <div className="text-3xl font-bold text-green-600">{Math.round(resultData.confidence)}%</div>
                    </div>
                    <div className="bg-white border-4 border-black p-2 shadow-[4px_4px_0_0_#000]">
                      <div className="text-gray-500 text-lg leading-none">QUESTIONS</div>
                      <div className="text-3xl font-bold text-blue-600">{questionNumber}</div>
                    </div>
                  </div>
                </div>
                
                {/* Right Col: Logic & Scoreboard */}
                <div className="w-full md:w-1/2 flex flex-col space-y-6">
                  {/* Wooden Scoreboard (Secondary Panel) */}
                  <div className="wooden-board p-4 text-center">
                    <h2 className="text-yellow-400 text-3xl mb-2 pixel-text">FINAL CONFIDENCE</h2>
                    <div className="text-5xl text-white font-bold pixel-text animate-bounce mt-2 animate-victory uppercase">
                      {resultData.confidence >= 90 ? 'LEGENDARY' : resultData.confidence >= 80 ? 'HIGH' : 'MEDIUM'}
                    </div>
                    <div className="mt-4 inline-block bg-black/50 text-white px-4 py-1 text-xl border-2 border-black">
                      MATCH COMPLETE
                    </div>
                  </div>
                  
                  {/* AI Reasoning Log */}
                  <div className="log-box flex-grow p-4 overflow-y-auto text-xl leading-relaxed shadow-[4px_4px_0_0_#000] flex flex-col min-h-[250px]">
                    <h3 className="text-white border-b-2 border-gray-600 mb-2 pb-1 uppercase tracking-wider">AI Intelligence Report:</h3>
                    <div className="text-green-400 opacity-90 text-lg tracking-tight whitespace-pre-wrap animate-fade-in" style={{ animationDelay: '1s' }}>
                      {prediction.signatureMetric}
                    </div>
                    <div className="mt-auto pt-4 text-yellow-400 animate-pulse typewriter" style={{ width: 'fit-content' }}>
                      _ prediction locked
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap justify-center gap-4 border-t-4 border-gray-400 pt-6">
                <button onClick={handleNewMatch} className="retro-button px-6 py-3 text-2xl font-bold">PLAY AGAIN</button>
                <button onClick={handleNewMatch} className="retro-button px-6 py-3 text-2xl font-bold bg-blue-400">NEW MATCH</button>
              </div>
            </div>
            {/* END: Main Panel */}
          </main>
        )}
      </div>
    </>
  )
}

// Force server-side rendering to prevent static prerender crash (NextRouter not mounted)
export async function getServerSideProps() {
  return { props: {} }
}
