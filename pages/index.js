import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Poké-Cricket Masters</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="h-screen w-screen font-pixel text-white bg-black">
        {/* BEGIN: Game Container */}
        <main className="relative w-full h-full crt overflow-hidden bg-retro-sky">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Poke-Cricket Masters Background"
              className="w-full h-full object-cover pixelated opacity-90 blur-[1px]"
              src="/hero-bg.jpeg"
            />
          </div>
          
          {/* BEGIN: UI Overlay Layer */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-8 pt-12">
            
            {/* BEGIN: Header / Logo */}
            <header className="text-center float relative z-20">
              {/* Logo Shadow/Border Base */}
              <div className="inline-block relative">
                <h1
                  className="text-4xl md:text-6xl lg:text-7xl text-retro-gold text-outline tracking-wider mb-2"
                  style={{ WebkitTextStroke: '2px black' }}
                >
                  <span className="block mb-2">POKÉ-CRICKET</span>
                  <span className="block text-retro-red">MASTERS</span>
                </h1>
                <p className="text-sm md:text-base lg:text-lg text-white text-outline-sm mt-4">
                  The Ultimate Cricket Challenge!
                </p>
              </div>
            </header>
            {/* END: Header / Logo */}
            
            {/* BEGIN: Central Game Board */}
            <section className="flex-1 flex items-center justify-center relative z-20 mt-8 mb-4">
              {/* Interactive Start Button / Board */}
              <button 
                onClick={() => router.push('/question')}
                className="relative group cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                {/* Board Background */}
                <div className="bg-retro-wood border-4 border-black px-8 py-6 md:px-16 md:py-8 shadow-pixel rounded-sm relative overflow-hidden">
                  {/* Wooden Texture lines */}
                  <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+CjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjMiIGZpbGw9IiMzMzMiLz4KPC9zdmc+')] pixelated"></div>
                  <h2 className="text-3xl md:text-5xl text-white text-outline relative z-10">
                    START GAME
                  </h2>
                </div>
                
                {/* Decorative Bats (Left/Right) */}
                <div
                  className="absolute -left-12 top-1/2 -translate-y-1/2 w-16 h-32 bg-retro-pitch border-4 border-black rotate-[-20deg] rounded-sm hidden md:block"
                  style={{
                    borderRadius: '4px 4px 50% 50%',
                    boxShadow: 'inset -4px 0 0 rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Handle */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-12 bg-gray-800 border-2 border-black"></div>
                  {/* Poke detail on bat */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500 rounded-full border-2 border-black overflow-hidden flex flex-col">
                    <div className="h-1/2 w-full bg-red-500 border-b border-black"></div>
                    <div className="h-1/2 w-full bg-white border-t border-black"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full border border-black"></div>
                    </div>
                  </div>
                </div>
                
                <div
                  className="absolute -right-12 top-1/2 -translate-y-1/2 w-16 h-32 bg-retro-pitch border-4 border-black rotate-[20deg] rounded-sm hidden md:block"
                  style={{
                    borderRadius: '4px 4px 50% 50%',
                    boxShadow: 'inset -4px 0 0 rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Handle */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-12 bg-gray-800 border-2 border-black"></div>
                  {/* Poke detail on bat */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500 rounded-full border-2 border-black overflow-hidden flex flex-col">
                    <div className="h-1/2 w-full bg-red-500 border-b border-black"></div>
                    <div className="h-1/2 w-full bg-white border-t border-black"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full border border-black"></div>
                    </div>
                  </div>
                </div>
              </button>
            </section>
            {/* END: Central Game Board */}
            
            {/* BEGIN: Footer / Press Start */}
            <footer className="text-center relative z-20 pb-8">
              <p className="text-xl md:text-3xl text-retro-gold text-outline pulse-text">
                PRESS START
              </p>
            </footer>
            {/* END: Footer / Press Start */}
          </div>
          {/* END: UI Overlay Layer */}
        </main>
        {/* END: Game Container */}
      </div>
    </>
  )
}
