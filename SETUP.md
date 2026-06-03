# Festival App Backend Setup

## Database Setup

1. Open phpMyAdmin or your MySQL client
2. Run the SQL file: `database/schema.sql`

```sql
-- Execute the entire schema.sql file to create:
-- - festival_app database
-- - tables: featured, festival_info, schedule, locations
-- - sample data
```

Or manually:

```bash
mysql -u root -p < database/schema.sql
```

## PHP Configuration

The PHP API files are located in `/api/` directory:

- `config.php` - Database connection configuration
- `featured.php` - Featured content endpoint
- `festival-info.php` - Festival information endpoint
- `schedule.php` - Artists/Schedule endpoint (with day parameter)
- `locations.php` - Festival locations endpoint

## API Endpoints

### Featured Content
```
GET /api/featured.php
```

### Festival Information
```
GET /api/festival-info.php
```

### Schedule
```
GET /api/schedule.php?day=saturday
GET /api/schedule.php?day=sunday
```

### Locations
```
GET /api/locations.php
```

## React Frontend

Update the API URLs in the React components (currently set to `http://localhost/festival-api/api/`):

Edit the fetch URLs in:
- `src/pages/HomePage.jsx`
- `src/pages/InfoPage.jsx`
- `src/pages/SchedulePage.jsx`
- `src/pages/MapPage.jsx`

## Running the App

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Set up PHP server** (if not using Apache):
   ```bash
   php -S localhost:8000 -t .
   ```

4. **Access the app:**
   - Frontend: `http://localhost:5173` (Vite default)
   - API: `http://localhost/festival-api/api/` (adjust based on your PHP server)

## Color Scheme

- **Vermilion**: #F03228 (Red)
- **White**: #FFFFFF
- **Black**: #000000
- **Cerulean**: #247BA0 (Blue)
- **Saffron**: #E3B505 (Yellow)

## Database Credentials

Update in `api/config.php`:
```php
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'festival_app';
```
