import '../styles/globals.css'
import { GameProvider } from '../contexts/GameContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <GameProvider>
      <Component {...pageProps} />
    </GameProvider>
  )
}
