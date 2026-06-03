import { useEffect, useState } from 'react'
import { Heart, Info, Music, MapPin, Home, Sun, Moon, Globe, Flag } from 'lucide-react'
import './App.css'
import HomePage from './pages/HomePage'
import InfoPage from './pages/InfoPage'
import SchedulePage from './pages/SchedulePage'
import MapPage from './pages/MapPage'
import { getTranslations } from './i18n.js'

const COLORS = {
  vermilion: '#F03228',
  white: '#FFFFFF',
  black: '#000000',
  cerulean: '#247BA0',
  saffron: '#E3B505',
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [language, setLanguage] = useState('nl')
  const [theme, setTheme] = useState('light')
  const text = getTranslations(language)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const renderPage = () => {
    const pageProps = { language, theme }
    switch (activeTab) {
      case 'home':
        return <HomePage {...pageProps} />
      case 'info':
        return <InfoPage {...pageProps} />
      case 'lineup':
        return <SchedulePage {...pageProps} />
      case 'map':
        return <MapPage {...pageProps} />
      default:
        return <HomePage {...pageProps} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Sansation, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b" style={{ backgroundColor: theme === 'dark' ? COLORS.black : COLORS.vermilion, borderColor: COLORS.black }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white">
            <Heart size={20} color={COLORS.vermilion} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">U</p>
            <h1 className="text-xl font-bold text-white tracking-[0.25em]">FESTIVAL</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={text.theme.toggle}
            className="rounded-full p-2 border border-white/20 bg-white/10 text-white transition hover:bg-white/20">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setLanguage(language === 'nl' ? 'en' : 'nl')}
            aria-label="Toggle language"
            className="rounded-full p-2 border border-white/20 bg-white/10 text-white transition hover:bg-white/20">
            <Globe size={18} />
          </button>
          <Flag size={20} color={COLORS.white} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24" style={{ backgroundColor: theme === 'dark' ? '#020617' : '#fff7ed' }}>
        {renderPage()}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around border-t" style={{ backgroundColor: COLORS.vermilion, borderColor: COLORS.black }}>
        <TabButton
          icon={Home}
          label={text.nav.home}
          active={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
        />
        <TabButton
          icon={Info}
          label={text.nav.info}
          active={activeTab === 'info'}
          onClick={() => setActiveTab('info')}
        />
        <TabButton
          icon={Music}
          label={text.nav.lineup}
          active={activeTab === 'lineup'}
          onClick={() => setActiveTab('lineup')}
        />
        <TabButton
          icon={MapPin}
          label={text.nav.map}
          active={activeTab === 'map'}
          onClick={() => setActiveTab('map')}
        />
      </div>
    </div>
  )
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-3 flex flex-col items-center gap-1 transition-colors"
      style={{
        backgroundColor: active ? COLORS.white : 'transparent',
      }}>
      <Icon size={24} color={active ? COLORS.black : COLORS.white} />
      <span className="text-xs font-medium" style={{ color: active ? COLORS.black : COLORS.white }}>
        {label}
      </span>
    </button>
  )
}

export default App
