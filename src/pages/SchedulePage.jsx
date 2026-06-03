import { useEffect, useState } from 'react'
import { t } from '../i18n.js'

const COLORS = {
  vermilion: '#F03228',
  white: '#FFFFFF',
  black: '#000000',
  cerulean: '#247BA0',
  saffron: '#E3B505',
}

export default function SchedulePage({ language }) {
  const [selectedDay, setSelectedDay] = useState('saturday')
  const [artists, setArtists] = useState([])
  const [selectedArtistId, setSelectedArtistId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchArtists(selectedDay)
  }, [selectedDay])

  const fetchArtists = async (day) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/schedule.php?day=${day}`)
      const data = await response.json()
      setArtists(data.data || [])
    } catch (error) {
      console.error('Error fetching schedule:', error)
      setArtists([
        { id: 1, name: 'Artist One', time: '12:00', stage: 'Main Stage', description: 'A high-energy opener with live beats, visuals and a warm festival welcome.' },
        { id: 2, name: 'Artist Two', time: '14:30', stage: 'Side Stage', description: 'A lively set featuring fresh sounds, local talent and an interactive crowd moment.' },
        { id: 3, name: 'Artist Three', time: '16:00', stage: 'Main Stage', description: 'An inspiring performance with a mix of music, talks and festival atmosphere.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-3xl bg-black p-5 shadow-lg">
        <h2 className="text-2xl font-bold text-white">{t(language, 'schedule.heading')}</h2>
        <p className="mt-2 text-sm text-white/80">{t(language, 'schedule.description')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DayButton
          label={t(language, 'schedule.saturday')}
          active={selectedDay === 'saturday'}
          onClick={() => setSelectedDay('saturday')}
          activeColor={COLORS.black}
          inactiveColor={COLORS.cerulean}
        />
        <DayButton
          label={t(language, 'schedule.sunday')}
          active={selectedDay === 'sunday'}
          onClick={() => setSelectedDay('sunday')}
          activeColor={COLORS.cerulean}
          inactiveColor={COLORS.black}
        />
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-lg border border-slate-200">
        {loading ? (
          <p className="text-center py-8" style={{ color: COLORS.cerulean }}>Loading...</p>
        ) : artists.length > 0 ? (
          artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              language={language}
              selected={selectedArtistId === artist.id}
              onSelect={() => setSelectedArtistId(selectedArtistId === artist.id ? null : artist.id)}
            />
          ))
        ) : (
          <p className="text-center py-8" style={{ color: COLORS.cerulean }}>{t(language, 'schedule.noData')}</p>
        )}
      </div>
    </div>
  )
}

function DayButton({ label, active, onClick, activeColor, inactiveColor }) {
  return (
    <button
      onClick={onClick}
      className="rounded-3xl py-3 text-sm font-semibold transition-colors"
      style={{
        backgroundColor: active ? activeColor : inactiveColor,
        color: COLORS.white,
        border: `1px solid ${active ? activeColor : inactiveColor}`,
      }}>
      {label}
    </button>
  )
}

function ArtistCard({ artist, language, selected, onSelect }) {
  const details = artist.description || 'Meer informatie volgt binnenkort op het festivalterrein.'

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-3xl border border-slate-300 bg-[#247BA0] p-4 text-left text-white shadow-sm transition hover:bg-[#1f6a92]"
    >
      <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
        <div className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: COLORS.white }}>
          {t(language, 'schedule.stageLabel')}
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold">{artist.name}</h3>
            <span className="text-sm font-semibold">{selected ? '−' : '+'}</span>
          </div>
          <p className="mt-1 text-sm" style={{ color: COLORS.white }}>
            {artist.time} · {artist.stage}
          </p>
          {selected && (
            <div className="mt-3 rounded-2xl bg-white/10 p-3 text-sm leading-6">
              <p className="font-semibold">Meer info</p>
              <p className="mt-1 text-white/90">{details}</p>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
