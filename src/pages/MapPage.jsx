import { useEffect, useState } from 'react'
import festivalMap from '../../assets/kaart_festival_markers.svg'
import { t } from '../i18n.js'

const COLORS = {
  vermilion: '#F03228',
  white: '#FFFFFF',
  black: '#000000',
  cerulean: '#247BA0',
  saffron: '#E3B505',
}

const FESTIVAL_CENTER = [52.0728, 5.0558]
const MAP_BOUNDS = {
  minLat: 52.0698,
  maxLat: 52.0758,
  minLng: 5.0528,
  maxLng: 5.0588,
}
const FALLBACK_LOCATIONS = [
  { id: 1, name: 'Main Stage', lat: 52.0728, lng: 5.0558, type: 'Stage' },
  { id: 2, name: 'Food Court', lat: 52.0732, lng: 5.0565, type: 'Food' },
  { id: 3, name: 'Info Booth', lat: 52.0722, lng: 5.0563, type: 'Info' },
  { id: 4, name: 'Chill Area', lat: 52.0720, lng: 5.0548, type: 'Relax' },
]

export default function MapPage({ language }) {
  const [locations, setLocations] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [selectedLocationId, setSelectedLocationId] = useState(null)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations.php')
      const data = await response.json()
      setLocations(data.data || [])
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLocations(FALLBACK_LOCATIONS)
    }
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t(language, 'map.locationError'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationError('')
      },
      () => {
        setLocationError(t(language, 'map.locationError'))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    )
  }

  const safeLocations = locations
    .map((location) => ({
      ...location,
      lat: Number(location.lat),
      lng: Number(location.lng),
    }))
    .filter((location) => Number.isFinite(location.lat) && Number.isFinite(location.lng))

  const locationCount = safeLocations.length

  const toMapPosition = (location) => {
    const left = ((location.lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100
    const top = ((MAP_BOUNDS.maxLat - location.lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100

    return {
      left: `${Math.max(0, Math.min(100, left))}%`,
      top: `${Math.max(0, Math.min(100, top))}%`,
    }
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="rounded-3xl bg-white p-5 shadow-lg" style={{ border: `1px solid ${COLORS.saffron}` }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: COLORS.cerulean }}>
              {t(language, 'map.heading')}
            </h2>
            <p className="mt-2 text-sm" style={{ color: COLORS.black }}>
              {t(language, 'map.subtitle')}
            </p>
          </div>
          <button
            onClick={requestLocation}
            className="rounded-full bg-[#247BA0] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f6a92]">
            {t(language, 'map.findMe')}
          </button>
        </div>
        {locationError && (
          <p className="mt-3 text-xs font-semibold" style={{ color: COLORS.vermilion }}>
            {locationError}
          </p>
        )}
      </div>

      <div className="rounded-3xl overflow-hidden border-2 relative" style={{ borderColor: COLORS.cerulean, height: '360px' }}>
        <img
          src={festivalMap}
          alt="Festival map"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {safeLocations.map((location) => {
          const position = toMapPosition(location)
          const isSelected = selectedLocationId === location.id
          return (
            <button
              key={location.id}
              type="button"
              aria-label={location.name}
              onClick={() => setSelectedLocationId(isSelected ? null : location.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow-lg transition hover:scale-110"
              style={{
                left: position.left,
                top: position.top,
                width: isSelected ? 18 : 14,
                height: isSelected ? 18 : 14,
                backgroundColor: isSelected ? COLORS.saffron : COLORS.vermilion,
                boxShadow: '0 0 0 4px rgba(255,255,255,0.35)',
              }}
            />
          )
        })}
        {userLocation && (() => {
          const position = toMapPosition({ lat: userLocation.lat, lng: userLocation.lng })
          return (
            <button
              type="button"
              aria-label={t(language, 'map.userLocation')}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow-lg"
              style={{
                left: position.left,
                top: position.top,
                width: 18,
                height: 18,
                backgroundColor: COLORS.cerulean,
                boxShadow: '0 0 0 5px rgba(255,255,255,0.35)',
              }}
            />
          )
        })()}
      </div>

      {selectedLocationId && (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
          {(() => {
            const location = safeLocations.find((item) => item.id === selectedLocationId)
            if (!location) return null
            return (
              <>
                <p className="text-xs uppercase tracking-[0.25em]" style={{ color: COLORS.vermilion }}>Meer info</p>
                <h3 className="mt-2 text-lg font-bold" style={{ color: COLORS.black }}>{location.name}</h3>
                <p className="mt-1 text-sm" style={{ color: COLORS.cerulean }}>{location.type}</p>
                <p className="mt-3 text-sm text-slate-700">
                  {location.description || 'Dit punt staat op de festivalkaart. Bekijk de route of gebruik dit als startpunt voor je bezoek.'}
                </p>
              </>
            )
          })()}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm" style={{ color: COLORS.black }}>
            Locaties
          </h3>
          <span className="text-xs font-semibold uppercase" style={{ color: COLORS.vermilion }}>
            {locationCount} {locationCount === 1 ? 'spot' : 'spots'}
          </span>
        </div>
        {safeLocations.map((location) => (
          <LocationItem key={location.id} location={location} />
        ))}
      </div>
    </div>
  )
}

function LocationItem({ location }) {
  return (
    <div className="rounded-3xl p-4 border-2" style={{ borderColor: COLORS.saffron, backgroundColor: COLORS.white }}>
      <div className="flex justify-between items-start gap-3">
        <div>
          <h4 className="font-bold text-sm" style={{ color: COLORS.black }}>
            {location.name}
          </h4>
          <p className="text-xs mt-1" style={{ color: COLORS.cerulean }}>
            {location.type}
          </p>
        </div>
        <span className="rounded-full px-2 py-1 text-[10px] font-semibold uppercase text-white" style={{ backgroundColor: COLORS.vermilion }}>
          Map
        </span>
      </div>
    </div>
  )
}
