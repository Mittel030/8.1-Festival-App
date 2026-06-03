# Festival App - Production Deployment Guide

## 🚀 Deployment Steps

### Prerequisites
- VPS or Hosting with PHP 7.4+, MySQL 5.7+, and Node.js
- SSH access to server
- Domain name (optional)
- SSL certificate (recommended)

### Step 1: Server Preparation

```bash
# SSH into server
ssh user@your_server.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nodejs npm php mysql-server apache2 git
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### Step 2: Clone and Setup

```bash
# Create app directory
cd /var/www
sudo mkdir festival-app
cd festival-app
sudo git clone <your-repo-url> .

# Set permissions
sudo chown -R www-data:www-data /var/www/festival-app
```

### Step 3: Database Setup

```bash
# Create MySQL user
mysql -u root -p
> CREATE USER 'festival_user'@'localhost' IDENTIFIED BY 'secure_password';
> GRANT ALL PRIVILEGES ON festival_app.* TO 'festival_user'@'localhost';
> FLUSH PRIVILEGES;
> exit;

# Import schema
mysql -u festival_user -p festival_app < database/schema.sql
```

### Step 4: Configure PHP

Edit `api/config.php`:
```php
$db_host = 'localhost';
$db_user = 'festival_user';
$db_pass = 'secure_password';  // Change to actual password
$db_name = 'festival_app';
```

### Step 5: Build Frontend

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Copy dist to web root
sudo cp -r dist/* /var/www/festival-app/public/

# Or configure Apache VirtualHost to serve from dist/
```

### Step 6: Configure Apache

Create `/etc/apache2/sites-available/festival.conf`:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    
    DocumentRoot /var/www/festival-app/dist
    
    <Directory /var/www/festival-app/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    <Directory /var/www/festival-app/api>
        RewriteEngine On
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
        Header set Access-Control-Allow-Headers "Content-Type"
    </Directory>
    
    Alias /api /var/www/festival-app/api
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/festival_error.log
    CustomLog ${APACHE_LOG_DIR}/festival_access.log combined
</VirtualHost>
```

Enable the site:
```bash
sudo a2ensite festival.conf
sudo systemctl reload apache2
```

### Step 7: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-apache

# Generate certificate
sudo certbot --apache -d your-domain.com

# Auto-renewal should be set up automatically
```

### Step 8: Environment Variables

Create `.env` in project root:
```env
VITE_API_URL=https://your-domain.com/api
NODE_ENV=production
```

---

## 🔒 Security Checklist

- [ ] Use HTTPS/SSL certificate
- [ ] Update database password
- [ ] Disable directory listing:
  ```apache
  <Directory />
    Options -Indexes
  </Directory>
  ```
- [ ] Update API CORS settings if needed
- [ ] Enable PHP opcache for performance
- [ ] Set up regular database backups
- [ ] Monitor error logs regularly
- [ ] Keep dependencies updated

---

## 📊 Performance Optimization

### Frontend
```bash
# Generate optimized build
npm run build

# Check build size
npm run build --analyze
```

### Backend
```php
# In api/config.php, enable error reporting carefully:
error_reporting(E_ALL);
ini_set('display_errors', 0);  // Log errors, don't display
ini_set('log_errors', 1);
```

### Database
```sql
-- Add indexes for common queries
CREATE INDEX idx_day ON schedule(day);
CREATE INDEX idx_type ON locations(type);
```

---

## 🔄 CI/CD Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build
        run: |
          npm install
          npm run build
      
      - name: Deploy
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.DEPLOY_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H ${{ secrets.DEPLOY_HOST }} >> ~/.ssh/known_hosts
          ssh -i ~/.ssh/deploy_key ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }} 'cd /var/www/festival-app && git pull && npm install && npm run build'
```

---

## 📈 Monitoring & Maintenance

### Check PHP Errors
```bash
tail -f /var/log/apache2/festival_error.log
```

### Monitor Database
```sql
-- Check database size
SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'festival_app';

-- Backup database
mysqldump -u festival_user -p festival_app > backup_$(date +%Y%m%d).sql
```

### System Resources
```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top -b -n 1
```

---

## 🐛 Troubleshooting

### 502 Bad Gateway
- Check PHP-FPM is running
- Review Apache error logs
- Verify database connection

### High Memory Usage
- Enable PHP opcache
- Optimize database queries
- Check for runaway processes

### Slow API Response
- Add database indexes
- Enable caching headers
- Monitor database performance

---

## 🔄 Rollback Procedure

```bash
# Keep previous versions
cd /var/www/festival-app
git log --oneline

# Rollback to previous commit
git checkout <commit_hash>
npm run build
sudo cp -r dist/* /var/www/html/
```

---

## 📞 Support

For deployment issues:
1. Check Apache error logs: `/var/log/apache2/error.log`
2. Check PHP error logs: `/var/log/php-fpm.log` or `/var/log/apache2/festival_error.log`
3. Verify MySQL connection: `mysql -u festival_user -p`
4. Test API endpoints manually

---

**Version**: 1.0.0  
**Last Updated**: May 2024
