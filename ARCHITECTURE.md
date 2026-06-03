# Festival App - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   React + Vite Frontend    │
        │   (SPA - Single Page App)  │
        ├────────────────────────────┤
        │  - HomePage                │
        │  - InfoPage                │
        │  - SchedulePage            │
        │  - MapPage                 │
        └────────────────┬───────────┘
                         │
        (CORS enabled    │ HTTP/AJAX
         API calls)      │
                         ▼
        ┌────────────────────────────┐
        │   PHP REST API Layer       │
        │   (Apache + PHP 7.4+)      │
        ├────────────────────────────┤
        │  - featured.php            │
        │  - festival-info.php       │
        │  - schedule.php            │
        │  - locations.php           │
        └────────────────┬───────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │   MySQL Database           │
        │   (5.7+)                   │
        ├────────────────────────────┤
        │  - featured (table)        │
        │  - festival_info (table)   │
        │  - schedule (table)        │
        │  - locations (table)       │
        └────────────────────────────┘
```

---

## 📦 Component Structure

### Frontend (React)

```
src/
├── App.jsx                    # Main component with tab routing
├── main.jsx                   # Entry point
├── index.css                  # Global styles
├── App.css                    # App-specific styles
├── api/
│   └── client.js             # API client service
└── pages/
    ├── HomePage.jsx          # Home tab
    ├── InfoPage.jsx          # Info tab
    ├── SchedulePage.jsx      # Lineup tab
    └── MapPage.jsx           # Map tab
```

#### Component Flow

```
App
├── Navigation Header
│   ├── Logo (Heart Icon)
│   └── Language Selector
│
├── Main Content (Dynamic)
│   ├── HomePage
│   ├── InfoPage
│   ├── SchedulePage
│   └── MapPage
│
└── Navigation Footer (Tab Bar)
    ├── Home Button
    ├── Info Button
    ├── Lineup Button
    └── Map Button
```

### Backend (PHP API)

```
api/
├── config.php                # Database configuration
├── featured.php              # GET /featured
├── festival-info.php         # GET /festival-info
├── schedule.php              # GET /schedule?day=saturday
├── locations.php             # GET /locations
├── index.php                 # API documentation (HTML)
└── .htaccess                 # Apache routing rules
```

#### API Response Format

All endpoints return standardized JSON:

```json
{
  "status": "success|error",
  "data": { /* endpoint-specific data */ },
  "message": "optional error message"
}
```

### Database Schema

```sql
Database: festival_app

Tables:
├── featured
│   ├── id (PK)
│   ├── title
│   ├── description
│   ├── date
│   ├── location
│   ├── created_at
│   └── updated_at
│
├── festival_info
│   ├── id (PK)
│   ├── title
│   ├── description
│   ├── location
│   ├── dates
│   ├── tickets
│   ├── created_at
│   └── updated_at
│
├── schedule
│   ├── id (PK)
│   ├── name
│   ├── day (ENUM: saturday, sunday)
│   ├── time (TIME)
│   ├── stage
│   ├── description
│   ├── created_at
│   └── updated_at
│   └── INDEX: idx_day
│
└── locations
    ├── id (PK)
    ├── name
    ├── type
    ├── latitude
    ├── longitude
    ├── description
    ├── created_at
    └── updated_at
```

---

## 🔄 Data Flow

### User Views Festival Info

```
1. User opens app
   └─> App.jsx loads
       └─> Renders HomePage

2. HomePage mounts
   └─> useEffect triggers
       └─> fetch('api/featured.php')
           └─> Frontend→API Request
               └─> PHP: config.php connects to MySQL
                   └─> Execute: SELECT * FROM featured
                       └─> Return JSON response
                           └─> React setState
                               └─> Component re-renders
                                   └─> User sees featured content
```

### User Views Schedule

```
1. User clicks "Lineup" tab
   └─> setActiveTab('lineup')
       └─> SchedulePage mounts

2. User selects day (Saturday/Sunday)
   └─> setSelectedDay(day)
       └─> useEffect triggers
           └─> fetch('api/schedule.php?day=saturday')
               └─> PHP processes day parameter
                   └─> Execute: SELECT * FROM schedule WHERE day='saturday'
                       └─> Return JSON array
                           └─> React renders ArtistCard components
                               └─> User sees schedule
```

### User Views Map

```
1. User clicks "Map" tab
   └─> MapPage mounts

2. MapPage useEffect runs
   └─> fetch('api/locations.php')
       └─> PHP returns location markers
           └─> Leaflet renders MapContainer with markers
               └─> User interacts with map
```

---

## 🎨 State Management

### App.jsx (Global State)
```javascript
const [activeTab, setActiveTab] = useState('home')
  └─> Controls which page is displayed
```

### Each Page Component (Local State)
```javascript
// HomePage.jsx
const [featured, setFeatured] = useState(null)

// SchedulePage.jsx
const [selectedDay, setSelectedDay] = useState('saturday')
const [artists, setArtists] = useState([])

// MapPage.jsx
const [locations, setLocations] = useState([])
```

---

## 🌐 API Communication

### Request Headers (Auto-added)
```
GET /api/featured.php HTTP/1.1
Host: api.example.com
Content-Type: application/json
Access-Control-Allow-Origin: *
```

### CORS Flow
```
Browser Request
├─> Pre-flight OPTIONS (for non-GET requests)
│   └─> Server responds with CORS headers
│
└─> Actual GET/POST request
    └─> Server responds with data + CORS headers
        └─> Browser allows access to response
```

---

## 🎯 Key Technologies & Why

| Tech | Purpose | Why |
|------|---------|-----|
| React | UI Framework | Component-based, reusable, efficient updates |
| Vite | Build Tool | Fast development, optimized builds |
| Tailwind CSS | Styling | Utility-first, quick iteration, consistent design |
| Leaflet | Maps | Lightweight, widely-used, great mobile support |
| PHP | Backend | Runs on any hosting, easy deployment |
| MySQL | Database | Reliable, widely-available, good for this scale |

---

## 🚀 Performance Considerations

### Frontend
- **Code Splitting**: React Router for lazy-loaded pages
- **Image Optimization**: Leaflet tiles are cached
- **CSS**: Tailwind purges unused styles in production

### Backend
- **Database Indexes**: Added on `schedule.day` for fast queries
- **Caching**: PHP can cache responses if needed
- **Query Optimization**: Using prepared statements (in config.php)

### Deployment
- **CDN**: Static assets (dist/) can be served from CDN
- **Compression**: Enable gzip in Apache
- **Caching Headers**: Set appropriate cache policies

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────┐
│     Browser (Client-side)               │
│  - XSS Protection (React auto-escapes)  │
│  - HTTPS only                           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│     CORS & HTTP Security                │
│  - CORS headers configured              │
│  - HTTPS enforced                       │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│     PHP Backend                         │
│  - Input validation                     │
│  - Prepared statements (SQL injection)  │
│  - Error logging (not displayed)        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│     MySQL Database                      │
│  - User permissions limited             │
│  - Password protected                   │
│  - Regular backups                      │
└─────────────────────────────────────────┘
```

---

## 📊 Scalability Path

### Current (Single Server)
```
User → Apache+PHP+MySQL (All on one server)
```

### Medium (Separate DB)
```
Users → Apache+PHP Server → MySQL Database Server
```

### Large (Load Balanced)
```
Users → Load Balancer
        ├─> Apache+PHP (Server 1)
        ├─> Apache+PHP (Server 2)
        └─> Apache+PHP (Server 3)
                ↓
            → MySQL (with replication)
            → Redis Cache
            → CDN
```

---

## 🔧 Customization Points

### Add New Page
1. Create component in `src/pages/NewPage.jsx`
2. Import in `App.jsx`
3. Add tab button in navigation
4. Create API endpoint in `api/new-endpoint.php`

### Add New Data
1. Create table in `database/schema.sql`
2. Create PHP endpoint in `api/`
3. Fetch data in React component
4. Display in UI

### Modify Colors
Edit `src/App.jsx`:
```javascript
const COLORS = {
  vermilion: '#F03228',  // Edit hex values
  cerulean: '#247BA0',
  // ...
}
```

---

## 📈 Monitoring & Debugging

### Frontend (Browser DevTools)
```
F12 → Console: Check for errors
     → Network: Inspect API calls
     → Application: Check service worker
```

### Backend (Server)
```bash
tail -f /var/log/apache2/festival_error.log
tail -f /var/log/php-fpm.log
```

### Database
```bash
mysql -u root -p
> SHOW PROCESSLIST;  # Check active queries
> SHOW TABLE STATUS; # Check table sizes
```

---

**Architecture Version**: 1.0.0  
**Last Updated**: May 2024
