# Heart U Festival App (PWA)

Eerste versie van een mobile progressive web app voor bezoekers van het Heart U Festival.

## Stack

- React + Vite
- Tailwind CSS (v4)
- Firebase Firestore
- Vite PWA plugin
- Leaflet + React Leaflet (festivalkaart)

## Features in deze versie

- Mobile-first interface met tabs voor Programma, Kaart en Interactie
- PWA-installatieprompt + service worker + manifest
- Programma met fallback demo-content en optionele Firebase collectie
- Festivalkaart met geolocatie van de bezoeker
- Camera + microfoon permissieflow als basis voor interactie-features
- Live shoutouts via Firebase (met lokale fallback)
- Push-notificatie permissie (basis)

## Lokaal draaien

1. Installeer dependencies:

```bash
npm install
```

2. Maak een `.env` op basis van `.env.example`:

```bash
cp .env.example .env
```

3. Vul je Firebase waarden in de `.env`.

4. Start development server:

```bash
npm run dev
```

5. Productie build testen:

```bash
npm run build
npm run preview
```

## Firestore collecties (optioneel)

### `programma`

Voorbeeld document:

```json
{
	"day": "zaterdag",
	"time": "14:30",
	"title": "Studentenclub Showcase",
	"stage": "Campus Court"
}
```

### `shoutouts`

Wordt door de app automatisch geschreven met:

- `text` (string)
- `createdAt` (server timestamp)

## Verplicht AI-logboek (module-eis)

Voeg in je repo een logboek toe, bijvoorbeeld `docs/ai-logboek.md`, met per prompt:

- datum + tijd
- gebruikte AI + model + tool/IDE
- letterlijke prompt
- korte samenvatting van resultaat

Zonder logboek wordt de opdracht niet beoordeeld.
