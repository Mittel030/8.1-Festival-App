# Festival App - Quick Start Guide

## 🚀 Fastest Setup (5 minutes)

### Using Docker (Recommended)

```bash
docker-compose up -d
```

This will start:
- MySQL database on port 3306
- PHP server on port 8000
- Access API at http://localhost:8000/api/

Then in another terminal:
```bash
npm install
npm run dev
```

---

## 📋 Manual Setup

### 1. Prerequisites Check
```bash
# Check Node.js
node --version  # Should be 16+

# Check PHP
php --version   # Should be 7.4+

# Check MySQL
mysql --version # Should be 5.7+
```

### 2. Database Setup

**Using Command Line:**
```bash
mysql -u root -p
> CREATE DATABASE festival_app;
> USE festival_app;
> source database/schema.sql;
> exit;
```

**Or using phpMyAdmin:**
1. Open `http://localhost/phpmyadmin`
2. Create new database: `festival_app`
3. Import `database/schema.sql`

### 3. PHP Configuration

Edit `api/config.php`:
```php
$db_host = 'localhost';
$db_user = 'root';
$db_pass = 'your_password';  // Add password if set
$db_name = 'festival_app';
```

### 4. Test PHP API

```bash
# Using built-in PHP server
php -S localhost:8000 -t .

# In another terminal, test:
curl http://localhost:8000/api/featured.php
```

Expected response:
```json
{
  "status": "success",
  "data": {
    "title": "Welcome to U Festival",
    ...
  }
}
```

### 5. Frontend Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 🔍 Testing

### Test API Endpoints
```bash
# Featured content
curl http://localhost:8000/api/featured.php

# Festival info
curl http://localhost:8000/api/festival-info.php

# Schedule (Saturday)
curl http://localhost:8000/api/schedule.php?day=saturday

# Locations
curl http://localhost:8000/api/locations.php
```

### Test Database Connection
Create `test-db.php`:
```php
<?php
require_once 'api/config.php';

if ($conn->connect_error) {
    echo 'Connection failed: ' . $conn->connect_error;
} else {
    echo 'Connected successfully!';
    
    $result = $conn->query("SELECT COUNT(*) as count FROM festival_info");
    $row = $result->fetch_assoc();
    echo 'Records in festival_info: ' . $row['count'];
}
?>
```

Then visit: `http://localhost:8000/test-db.php`

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot connect to database"
**Solution:**
1. Verify MySQL is running: `mysql -u root -p`
2. Check credentials in `api/config.php`
3. Ensure `festival_app` database exists: `SHOW DATABASES;`

### Issue: CORS errors in browser
**Solution:**
1. Check `api/config.php` has CORS headers
2. Verify `.htaccess` exists in `api/` folder
3. Enable Apache mod_rewrite: `a2enmod rewrite`
4. Restart Apache: `sudo systemctl restart apache2`

### Issue: Leaflet map not showing
**Solution:**
1. Check internet connection (needs OpenStreetMap tiles)
2. Verify Leaflet CSS imported in `main.jsx`
3. Check browser console for errors (F12)

### Issue: API URLs not working
**Solution:**
Update the API URL in React components:
- Change `http://localhost/festival-api/api/` 
- To your actual server URL

---

## 📊 Project Files Location

```
- Frontend: src/
  - Components: src/pages/
  - Styles: src/App.css, src/index.css
  
- Backend: api/
  - Config: api/config.php
  - Endpoints: api/*.php
  
- Database: database/
  - Schema: database/schema.sql
```

---

## 🎨 UI/UX Guide

### Available Components
- **HomePage** - Featured events display
- **InfoPage** - Festival information
- **SchedulePage** - Artist lineup with day selection
- **MapPage** - Interactive map with locations

### Color Usage
```
Primary (Cerulean #247BA0) - Header, buttons
Accent (Saffron #E3B505) - Highlights, secondary buttons
Alert (Vermilion #F03228) - Important info
Text (Black #000000) - Default text
Background (White #FFFFFF) - Main background
```

---

## 📱 Mobile Optimization

The app is fully responsive:
- Mobile-first design
- Bottom tab navigation (native app feel)
- Touch-friendly buttons
- Optimized images

Test on mobile:
```bash
# Get your IP
ipconfig getifaddr en0  # Mac/Linux
ipconfig             # Windows

# Access from mobile on same network
http://YOUR_IP:5173
```

---

## 🚢 Deployment

### Deploy to Production

1. **Build React app:**
   ```bash
   npm run build
   ```

2. **Upload files:**
   - Upload `dist/` contents to web root
   - Upload `api/` folder to web server

3. **Configure:**
   - Update API URLs in components
   - Update database credentials
   - Enable HTTPS

4. **Database:**
   - Create database on production MySQL
   - Run `database/schema.sql`

### Using GitHub Pages (Frontend only)
```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

---

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check PHP error logs
3. Review README.md for API documentation
4. Verify all dependencies are installed

---

**Last Updated**: May 2024
