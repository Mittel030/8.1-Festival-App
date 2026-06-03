import { useEffect, useState } from 'react'
import { t } from '../i18n.js'

const COLORS = {
  vermilion: '#F03228',
  white: '#FFFFFF',
  black: '#000000',
  cerulean: '#247BA0',
  saffron: '#E3B505',
}

export default function HomePage({ language }) {
  const [featured, setFeatured] = useState(null)

  useEffect(() => {
    fetchFeatured()
  }, [])

  const fetchFeatured = async () => {
    try {
      const response = await fetch('/api/featured.php')
      const data = await response.json()
      setFeatured(data.data)
    } catch (error) {
      console.error('Error fetching featured content:', error)
      setFeatured({
        title: 'Welcome to U Festival',
        description: 'Join us for an unforgettable experience',
        date: 'June 15-16, 2024',
      })
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-3xl bg-[#247BA0] p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.35em] text-white/80">U Festival</p>
        <h2 className="mt-3 text-3xl font-black leading-tight text-white">
          {t(language, 'home.title')}
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/80">
          {t(language, 'home.subtitle')}
        </p>
        <div className="mt-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
          {featured?.date || t(language, 'home.featuredDate')}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color: COLORS.black }}>
            Featured
          </h3>
          <span className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS.saffron }}>
            Now live
          </span>
        </div>

        <div
          className="rounded-3xl p-5"
          style={{ border: `2px solid ${COLORS.saffron}`, backgroundColor: COLORS.white }}>
          <h4 className="font-bold text-xl mb-1" style={{ color: COLORS.black }}>
            {featured?.title || 'Main Event'}
          </h4>
          <p className="text-sm mb-3" style={{ color: COLORS.cerulean }}>
            {featured?.date || 'June 15-16'}
          </p>
          <div className="inline-flex rounded-full px-3 py-2 text-xs font-semibold" style={{ color: COLORS.black, backgroundColor: 'rgba(224, 181, 5, 0.16)' }}>
            In the heart of Utrecht
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border-2 p-4" style={{ borderColor: COLORS.cerulean, backgroundColor: COLORS.white }}>
            <p className="text-sm font-semibold" style={{ color: COLORS.cerulean }}>{t(language, 'home.highlight1')}</p>
            <p className="mt-2 text-xs" style={{ color: COLORS.black }}>{t(language, 'home.highlight1Text')}</p>
          </div>
          <div className="rounded-3xl border-2 p-4" style={{ borderColor: COLORS.vermilion, backgroundColor: COLORS.white }}>
            <p className="text-sm font-semibold" style={{ color: COLORS.vermilion }}>{t(language, 'home.highlight2')}</p>
            <p className="mt-2 text-xs" style={{ color: COLORS.black }}>{t(language, 'home.highlight2Text')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
