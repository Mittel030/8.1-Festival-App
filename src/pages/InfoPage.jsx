import { useEffect, useState } from 'react'
import { t } from '../i18n.js'

const COLORS = {
  vermilion: '#F03228',
  white: '#FFFFFF',
  black: '#000000',
  cerulean: '#247BA0',
  saffron: '#E3B505',
}

export default function InfoPage({ language }) {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState(0)

  useEffect(() => {
    fetchInfo()
  }, [])

  const fetchInfo = async () => {
    try {
      const response = await fetch('/api/festival-info.php')
      const data = await response.json()
      setInfo(data.data)
    } catch (error) {
      console.error('Error fetching info:', error)
      setInfo({
        title: 'Festival Information',
        description: 'Lorem ipsum dolor ant sam. consectetur adipiscing elit. Aliquam at euam festde ut-elegant, elenendi les risus.\n\nLorem ipsum dolor ant sam. consectetur adipiscing elit. Aliquam at euavi festa ut-elegant, elenendi les risus.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-3xl bg-black p-5 shadow-lg">
        <h2 className="text-2xl font-bold text-white">{t(language, 'info.heading')}</h2>
        <p className="mt-2 text-sm text-white/80">{t(language, 'info.description')}</p>
      </div>

      <div className="space-y-3">
        {t(language, 'info.sections').map((section, index) => (
          <button
            key={section.title}
            className="w-full rounded-3xl border border-slate-300 bg-white p-4 text-left shadow-sm"
            onClick={() => setOpenIndex(index)}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold" style={{ color: COLORS.cerulean }}>{section.title}</h3>
              </div>
              <span className="text-sm font-semibold" style={{ color: COLORS.vermilion }}>
                {openIndex === index ? '-' : '+'}
              </span>
            </div>
            {openIndex === index && (
              <p className="mt-3 text-sm" style={{ color: COLORS.black }}>
                {section.content}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
