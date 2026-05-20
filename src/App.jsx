import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { db } from './firebase'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const FESTIVAL_CENTER = [52.0728, 5.0558]

const DEFAULT_PROGRAMMA = {
  zaterdag: [
    { time: '12:00', title: 'Opening met Utrecht DJ Collective', stage: 'Main Meadow' },
    { time: '14:30', title: 'Studentenclub Showcase', stage: 'Campus Court' },
    { time: '16:15', title: 'Wetenschapsquiz Live', stage: 'Brain Dome' },
    { time: '20:30', title: 'Headliner: Nederlands Talentblok', stage: 'Main Meadow' },
  ],
  zondag: [
    { time: '11:30', title: 'Morning Acoustic Sessions', stage: 'River Side' },
    { time: '13:30', title: 'Theater op Gras', stage: 'Campus Court' },
    { time: '17:00', title: 'Community Cypher', stage: 'Flow Area' },
    { time: '21:00', title: 'Closing Lights & Beats', stage: 'Main Meadow' },
  ],
}

const FESTIVAL_ZONES = [
  { id: 1, name: 'Main Meadow', position: [52.0728, 5.0558], type: 'Muziek' },
  { id: 2, name: 'Brain Dome', position: [52.0732, 5.0565], type: 'Wetenschap' },
  { id: 3, name: 'Campus Court', position: [52.0722, 5.0563], type: 'Clubs' },
  { id: 4, name: 'Food Plaza', position: [52.0725, 5.0551], type: 'Eten' },
]

function App() {
  const [activeTab, setActiveTab] = useState('programma')
  const [dag, setDag] = useState('zaterdag')
  const [programma, setProgramma] = useState(DEFAULT_PROGRAMMA)
  const [userPos, setUserPos] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [shoutouts, setShoutouts] = useState([])
  const [message, setMessage] = useState('')
  const [loadingProgramma, setLoadingProgramma] = useState(true)
  const [firebaseError, setFirebaseError] = useState('')
  const [mediaEnabled, setMediaEnabled] = useState(false)
  const [mediaError, setMediaError] = useState('')
  const [installPrompt, setInstallPrompt] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    let ignore = false

    async function loadProgramma() {
      if (!db) {
        setLoadingProgramma(false)
        return
      }

      try {
        const snapshot = await getDocs(collection(db, 'programma'))
        if (ignore || snapshot.empty) {
          setLoadingProgramma(false)
          return
        }

        const mapped = { zaterdag: [], zondag: [] }
        snapshot.forEach((doc) => {
          const item = doc.data()
          const dayKey = item.day === 'zondag' ? 'zondag' : 'zaterdag'
          mapped[dayKey].push({
            time: item.time ?? '00:00',
            title: item.title ?? 'Nog te bevestigen',
            stage: item.stage ?? 'TBA',
          })
        })

        if (!mapped.zaterdag.length && !mapped.zondag.length) {
          setLoadingProgramma(false)
          return
        }

        setProgramma(mapped)
      } catch {
        setFirebaseError('Firebase data kon niet worden geladen. De demo-content wordt getoond.')
      } finally {
        if (!ignore) {
          setLoadingProgramma(false)
        }
      }
    }

    loadProgramma()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!db) {
      return undefined
    }

    const shoutoutsQuery = query(
      collection(db, 'shoutouts'),
      orderBy('createdAt', 'desc'),
      limit(20),
    )

    const unsubscribe = onSnapshot(
      shoutoutsQuery,
      (snapshot) => {
        setShoutouts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      },
      () => {
        setFirebaseError('Realtime shoutouts zijn tijdelijk niet beschikbaar.')
      },
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocatie wordt niet ondersteund op dit device.')
      return undefined
    }

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setUserPos([coords.latitude, coords.longitude])
        setLocationError('')
      },
      () => {
        setLocationError('Locatie ophalen mislukt. Controleer je permissies.')
      },
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 15000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  useEffect(() => {
    function onBeforeInstallPrompt(event) {
      event.preventDefault()
      setInstallPrompt(event)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  }, [])

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [mediaEnabled])

  const activeProgramma = useMemo(() => programma[dag] ?? [], [programma, dag])

  async function postShoutout(event) {
    event.preventDefault()
    if (!message.trim()) {
      return
    }

    const payload = {
      text: message.trim(),
      createdAt: serverTimestamp(),
    }

    if (!db) {
      setShoutouts((current) => [{ id: crypto.randomUUID(), text: payload.text }, ...current])
      setMessage('')
      return
    }

    try {
      await addDoc(collection(db, 'shoutouts'), payload)
      setMessage('')
    } catch {
      setFirebaseError('Je shoutout kon niet worden geplaatst.')
    }
  }

  async function toggleMedia() {
    if (mediaEnabled && streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setMediaEnabled(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      setMediaEnabled(true)
      setMediaError('')
    } catch {
      setMediaError('Camera/microfoon zijn geweigerd of niet beschikbaar.')
    }
  }

  async function triggerInstall() {
    if (!installPrompt) {
      return
    }

    await installPrompt.prompt()
    setInstallPrompt(null)
  }

  async function enableNotifications() {
    if (!('Notification' in window)) {
      return
    }

    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      new Notification('Heart U Festival', {
        body: 'Push-notificaties staan aan. Je mist geen updates meer.',
      })
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-amber-50 pb-28 text-stone-900 shadow-xl">
      <header className="relative overflow-hidden rounded-b-4xl bg-gradient-to-br from-orange-400 via-rose-400 to-red-500 px-5 pb-6 pt-8 text-white">
        <div className="absolute -right-12 -top-10 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <p className="text-xs font-semibold tracking-[0.2em]">15 - 16 AUG 2026 · STRIJKVIERTEL</p>
        <h1 className="mt-2 text-4xl font-black leading-tight">Heart U Festival</h1>
        <p className="mt-2 max-w-sm text-sm text-orange-50">
          Live programma, kaart en interactieve festivalfuncties in een installable PWA.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {installPrompt && (
            <button
              type="button"
              onClick={triggerInstall}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600"
            >
              Installeer app
            </button>
          )}
          <button
            type="button"
            onClick={enableNotifications}
            className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white"
          >
            Activeer meldingen
          </button>
        </div>
      </header>

      <main className="space-y-5 px-4 pt-5">
        {firebaseError && (
          <p className="rounded-2xl border border-amber-300 bg-amber-100 px-3 py-2 text-sm">{firebaseError}</p>
        )}

        {activeTab === 'programma' && (
          <section className="space-y-3">
            <div className="flex rounded-2xl bg-white p-1 shadow-sm ring-1 ring-orange-100">
              <button
                type="button"
                onClick={() => setDag('zaterdag')}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
                  dag === 'zaterdag' ? 'bg-orange-500 text-white' : 'text-stone-500'
                }`}
              >
                Zaterdag
              </button>
              <button
                type="button"
                onClick={() => setDag('zondag')}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
                  dag === 'zondag' ? 'bg-orange-500 text-white' : 'text-stone-500'
                }`}
              >
                Zondag
              </button>
            </div>

            {loadingProgramma ? (
              <p className="text-sm text-stone-500">Programma laden...</p>
            ) : (
              <ul className="space-y-3">
                {activeProgramma.map((item) => (
                  <li
                    key={`${item.time}-${item.title}`}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">{item.time}</p>
                    <p className="mt-1 text-lg font-bold">{item.title}</p>
                    <p className="text-sm text-stone-600">{item.stage}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === 'kaart' && (
          <section className="space-y-3">
            <div className="overflow-hidden rounded-3xl ring-1 ring-orange-100">
              <MapContainer center={FESTIVAL_CENTER} zoom={16} className="h-80 w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {FESTIVAL_ZONES.map((zone) => (
                  <Marker key={zone.id} position={zone.position}>
                    <Popup>
                      <strong>{zone.name}</strong>
                      <br />
                      {zone.type}
                    </Popup>
                  </Marker>
                ))}
                {userPos && (
                  <>
                    <Marker position={userPos}>
                      <Popup>Jij bent hier</Popup>
                    </Marker>
                    <Circle center={userPos} radius={30} pathOptions={{ color: '#f97316' }} />
                  </>
                )}
              </MapContainer>
            </div>
            {locationError && <p className="text-sm text-red-600">{locationError}</p>}
          </section>
        )}

        {activeTab === 'interactie' && (
          <section className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
              <h2 className="text-lg font-black">Camera + microfoon test</h2>
              <p className="mt-1 text-sm text-stone-600">
                Gebruik deze feature voor challenges op locaties en bezoekersinteractie.
              </p>
              <button
                type="button"
                onClick={toggleMedia}
                className="mt-3 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
              >
                {mediaEnabled ? 'Stop media' : 'Start camera + microfoon'}
              </button>
              {mediaError && <p className="mt-2 text-sm text-red-600">{mediaError}</p>}
              <video ref={videoRef} autoPlay muted playsInline className="mt-3 w-full rounded-2xl bg-stone-200" />
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
              <h2 className="text-lg font-black">Live shoutouts</h2>
              <form onSubmit={postShoutout} className="mt-3 flex gap-2">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Stuur een bericht naar andere bezoekers"
                  className="w-full rounded-full border border-stone-300 px-4 py-2 text-sm outline-none focus:border-orange-400"
                />
                <button
                  type="submit"
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Send
                </button>
              </form>
              <ul className="mt-3 space-y-2">
                {shoutouts.length === 0 && <li className="text-sm text-stone-500">Nog geen berichten.</li>}
                {shoutouts.map((item) => (
                  <li key={item.id} className="rounded-xl bg-orange-50 px-3 py-2 text-sm">
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <nav className="fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 gap-2 border-t border-orange-100 bg-white p-3">
        <button
          type="button"
          className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
            activeTab === 'programma' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-stone-600'
          }`}
          onClick={() => setActiveTab('programma')}
        >
          Programma
        </button>
        <button
          type="button"
          className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
            activeTab === 'kaart' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-stone-600'
          }`}
          onClick={() => setActiveTab('kaart')}
        >
          Kaart
        </button>
        <button
          type="button"
          className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
            activeTab === 'interactie' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-stone-600'
          }`}
          onClick={() => setActiveTab('interactie')}
        >
          Interactie
        </button>
      </nav>
    </div>
  )
}

export default App
