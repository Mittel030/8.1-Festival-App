import { useEffect, useState } from 'react'

const COLORS = {
  vermilion: '#F03228',
  white: '#FFFFFF',
  black: '#000000',
  cerulean: '#247BA0',
  saffron: '#E3B505',
}

const EMPTY_FORM = {
  name: '',
  type: 'Stage',
  latitude: '',
  longitude: '',
  description: '',
}

export default function AdminPage() {
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

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
      setStatusMessage('Kon locaties niet laden. Controleer de API.')
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.latitude || !form.longitude) {
      setStatusMessage('Vul naam, latitude en longitude in.')
      return
    }

    setIsSaving(true)
    setStatusMessage('')

    try {
      const payload = {
        name: form.name,
        type: form.type,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        description: form.description,
      }

      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/locations.php?id=${editingId}` : '/api/locations.php'
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (data.status !== 'success') {
        throw new Error(data.message || 'Opslaan mislukt')
      }

      setStatusMessage(editingId ? 'Locatie bijgewerkt.' : 'Locatie toegevoegd.')
      setForm(EMPTY_FORM)
      setEditingId(null)
      await fetchLocations()
    } catch (error) {
      console.error('Error saving location:', error)
      setStatusMessage(`Fout bij opslaan: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (location) => {
    setEditingId(location.id)
    setForm({
      name: location.name,
      type: location.type || 'Stage',
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      description: location.description || '',
    })
    setStatusMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setStatusMessage('Bewerking geannuleerd.')
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Weet je zeker dat je deze locatie wilt verwijderen?')
    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(`/api/locations.php?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.status !== 'success') {
        throw new Error(data.message || 'Verwijderen mislukt')
      }
      setStatusMessage('Locatie verwijderd.')
      fetchLocations()
    } catch (error) {
      console.error('Error deleting location:', error)
      setStatusMessage(`Fout bij verwijderen: ${error.message}`)
    }
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="rounded-3xl bg-white p-5 shadow-lg" style={{ border: `1px solid ${COLORS.saffron}` }}>
        <h2 className="text-2xl font-bold" style={{ color: COLORS.cerulean }}>
          FESTIVAL CMS
        </h2>
        <p className="mt-2 text-sm" style={{ color: COLORS.black }}>
          Beheer festivallocaties direct vanuit de app. Voeg nieuwe plekken toe, wijzig bestaande locaties en werk de kaartdata bij.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-lg" style={{ border: `1px solid ${COLORS.cerulean}` }}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold" style={{ color: COLORS.black }}>
                {editingId ? 'Locatie bewerken' : 'Nieuwe locatie toevoegen'}
              </h3>
              <p className="text-xs mt-1" style={{ color: COLORS.black }}>
                Vul de coördinaten in en sla op om kaartmarkers bij te werken.
              </p>
            </div>
            {editingId && (
              <button
                className="rounded-full px-4 py-2 text-xs font-semibold text-white"
                style={{ backgroundColor: COLORS.vermilion }}
                onClick={handleCancelEdit}>
                Annuleren
              </button>
            )}
          </div>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">
                Naam
                <input
                  className="mt-1 w-full rounded-2xl border p-3"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Main Stage"
                  required
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">
                Type
                <input
                  className="mt-1 w-full rounded-2xl border p-3"
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  placeholder="Stage, Food, Info"
                />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">
                Latitude
                <input
                  className="mt-1 w-full rounded-2xl border p-3"
                  name="latitude"
                  type="number"
                  step="0.000001"
                  value={form.latitude}
                  onChange={handleInputChange}
                  placeholder="52.072800"
                  required
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">
                Longitude
                <input
                  className="mt-1 w-full rounded-2xl border p-3"
                  name="longitude"
                  type="number"
                  step="0.000001"
                  value={form.longitude}
                  onChange={handleInputChange}
                  placeholder="5.055800"
                  required
                />
              </label>
            </div>

            <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">
              Beschrijving
              <textarea
                className="mt-1 w-full rounded-2xl border p-3 resize-none"
                name="description"
                rows="3"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Optionele beschrijving"
              />
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full px-5 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: COLORS.vermilion }}>
              {isSaving ? 'Opslaan...' : editingId ? 'Bijwerken' : 'Toevoegen'}
            </button>
          </form>

          {statusMessage && (
            <div className="rounded-3xl border p-3 text-sm" style={{ borderColor: COLORS.saffron, color: COLORS.black, backgroundColor: '#fff8e1' }}>
              {statusMessage}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-lg" style={{ border: `1px solid ${COLORS.saffron}` }}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold" style={{ color: COLORS.black }}>
              Locaties beheren
            </h3>
            <p className="text-xs mt-1" style={{ color: COLORS.black }}>
              Klik op een locatie om deze te bewerken, of verwijder een locatie direct.
            </p>
          </div>
          <span className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold uppercase text-white">
            {locations.length} locaties
          </span>
        </div>

        <div className="space-y-3">
          {locations.length === 0 && (
            <div className="rounded-3xl border p-4 text-sm" style={{ borderColor: COLORS.cerulean, color: COLORS.black }}>
              Geen locatiegegevens gevonden.
            </div>
          )}

          {locations.map((location) => (
            <div
              key={location.id}
              className="rounded-3xl border p-4 bg-slate-50"
              style={{ borderColor: COLORS.saffron }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="font-bold" style={{ color: COLORS.black }}>
                    {location.name}
                  </h4>
                  <p className="text-xs mt-1" style={{ color: COLORS.cerulean }}>
                    {location.type} · {location.lat}, {location.lng}
                  </p>
                  {location.description && <p className="text-xs mt-2" style={{ color: COLORS.black }}>{location.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-full px-4 py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: COLORS.cerulean }}
                    onClick={() => handleEdit(location)}>
                    Bewerk
                  </button>
                  <button
                    className="rounded-full px-4 py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: COLORS.vermilion }}
                    onClick={() => handleDelete(location.id)}>
                    Verwijder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
