# U Festival App

A mobile-responsive festival application built with React, Tailwind CSS, Leaflet, PHP, and MySQL.

## 🎨 Design

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet
- **Backend**: PHP + MySQL
- **Icons**: Lucide React

### Color Scheme
- **Vermilion**: #F03228 (Red accents)
- **Cerulean**: #247BA0 (Primary blue)
- **Saffron**: #E3B505 (Yellow highlights)
- **Black**: #000000 (Text)
- **White**: #FFFFFF (Background)

## 📱 Features

### Pages

1. **Home** - Welcome page with featured events
2. **Info** - Festival information and details
3. **Lineup** - Schedule with day selection (Saturday/Sunday)
4. **Map** - Interactive festival map with Leaflet

### Navigation

Bottom tab navigation with 4 main sections:
- Home (with heart icon)
- Info
- Lineup (with music icon)
- Map (with map pin icon)

## 🚀 Setup Instructions

### Prerequisites

- Node.js 16+
- PHP 7.4+
- MySQL 5.7+
- Apache with mod_rewrite (optional, for .htaccess routing)

### 1. Database Setup

```bash
# Option A: Using MySQL command line
mysql -u root -p < database/schema.sql

# Option B: Using phpMyAdmin
1. Create a new database named "festival_app"
2. Import the database/schema.sql file
```

### 2. PHP Configuration

Edit `api/config.php`:
```php
$db_host = 'localhost';    // Your MySQL host
$db_user = 'root';         // Your MySQL user
$db_pass = '';             // Your MySQL password
$db_name = 'festival_app'; // Database name
```

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. API Configuration

Update API URLs in the React components:

**File**: `src/pages/HomePage.jsx`, `src/pages/InfoPage.jsx`, etc.

Change:
```javascript
const response = await fetch('http://localhost/festival-api/api/featured.php')
```

To your actual API endpoint:
```javascript
const response = await fetch('http://your-domain.com/api/featured.php')
```

Or use environment variables:

Create `.env`:
```env
VITE_API_URL=http://localhost/festival-api/api
```

Then update components:
```javascript
const API_URL = import.meta.env.VITE_API_URL
const response = await fetch(`${API_URL}/featured.php`)
```

## 📂 Project Structure

```
festival-app/
├── api/
│   ├── config.php              # Database connection
│   ├── featured.php            # Featured content endpoint
│   ├── festival-info.php       # Festival info endpoint
│   ├── schedule.php            # Schedule/artists endpoint
│   ├── locations.php           # Locations endpoint
│   └── .htaccess               # Apache routing
├── database/
│   └── schema.sql              # Database schema & sample data
├── public/                     # Static assets
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx        # Home page
│   │   ├── InfoPage.jsx        # Info page
│   │   ├── SchedulePage.jsx    # Schedule page
│   │   └── MapPage.jsx         # Map page
│   ├── api/
│   │   └── client.js           # API client service
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.js
├── SETUP.md                    # Setup instructions
└── README.md                   # This file
```

## 🌐 API Endpoints

All endpoints are GET requests and return JSON:

### `/api/featured.php`
Returns featured festival content
```json
{
  "status": "success",
  "data": {
    "title": "Welcome to U Festival",
    "description": "...",
    "date": "June 15-16, 2024",
    "location": "Utrecht, Netherlands"
  }
}
```

### `/api/festival-info.php`
Returns detailed festival information
```json
{
  "status": "success",
  "data": {
    "title": "Festival Information",
    "description": "...",
    "location": "...",
    "dates": "...",
    "tickets": "..."
  }
}
```

### `/api/schedule.php?day=saturday`
Returns artists/performers for selected day
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Artist Name",
      "time": "12:00",
      "stage": "Main Stage"
    }
  ]
}
```

Parameters:
- `day`: `saturday` or `sunday`

### `/api/locations.php`
Returns festival location markers
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Main Stage",
      "lat": 52.0728,
      "lng": 5.0558,
      "type": "Stage"
    }
  ]
}
```

## 🔧 Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### File Structure for PHP Server

If using local PHP development server:
```bash
php -S localhost:8000 -t .
```

Access:
- Frontend: `http://localhost:5173`
- API: `http://localhost:8000/api/featured.php`

## 📦 Dependencies

### Frontend
- `react` - UI library
- `react-dom` - DOM rendering
- `react-leaflet` - React wrapper for Leaflet
- `leaflet` - Mapping library
- `lucide-react` - Icon library
- `tailwindcss` - Utility-first CSS
- `vite` - Build tool

### Backend
- PHP 7.4+
- MySQL 5.7+

## 🎯 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🚨 Troubleshooting

### CORS Errors
If you see CORS errors, ensure:
1. `api/config.php` has proper CORS headers
2. `api/.htaccess` is properly configured
3. PHP headers are being sent (check `php.ini`)

### Database Connection Fails
1. Check MySQL is running
2. Verify credentials in `api/config.php`
3. Ensure `festival_app` database exists
4. Check MySQL user permissions

### Leaflet Map Not Loading
1. Ensure Leaflet CSS is imported in `main.jsx`
2. Check browser console for errors
3. Verify internet connection for map tiles

## 📄 License

Open source

## 👨‍💻 Support

For issues or questions, check:
1. SETUP.md for detailed setup
2. Console errors in browser DevTools
3. PHP error logs in your server

---

**Version**: 1.0.0  
**Last Updated**: May 2024

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
