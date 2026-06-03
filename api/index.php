<?php
/**
 * Festival App - API Documentation
 * 
 * This file provides an overview of available endpoints
 */

header('Content-Type: text/html; charset=utf-8');

$current_host = $_SERVER['HTTP_HOST'];
$base_url = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$base_url .= '://' . $current_host . dirname($_SERVER['REQUEST_URI']);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Festival App - API Documentation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #247BA0 0%, #F03228 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: #247BA0;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }
        .content {
            padding: 30px;
        }
        .endpoint {
            margin-bottom: 30px;
            border-left: 4px solid #E3B505;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 4px;
        }
        .endpoint h3 {
            color: #247BA0;
            margin-bottom: 10px;
            font-size: 1.3em;
        }
        .endpoint code {
            background: #000;
            color: #0f0;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .method {
            display: inline-block;
            background: #247BA0;
            color: white;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.85em;
            font-weight: bold;
            margin-right: 10px;
        }
        .endpoint p {
            color: #555;
            line-height: 1.6;
            margin: 10px 0;
        }
        .endpoint a {
            color: #247BA0;
            text-decoration: none;
            font-weight: bold;
        }
        .endpoint a:hover {
            text-decoration: underline;
        }
        .colors {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .color-box {
            padding: 20px;
            color: white;
            border-radius: 4px;
            text-align: center;
            font-size: 0.9em;
            font-weight: bold;
        }
        .color-box span {
            display: block;
            margin-top: 10px;
            font-size: 0.8em;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎪 U Festival App</h1>
            <p>Festival Management API</p>
        </div>
        
        <div class="content">
            <h2 style="color: #247BA0; margin-bottom: 20px;">Available API Endpoints</h2>
            
            <div class="endpoint">
                <h3><span class="method">GET</span>/api/featured.php</h3>
                <p>Returns featured festival content</p>
                <p>📍 <a href="<?php echo $base_url; ?>/featured.php" target="_blank"><?php echo $base_url; ?>/featured.php</a></p>
            </div>

            <div class="endpoint">
                <h3><span class="method">GET</span>/api/festival-info.php</h3>
                <p>Returns detailed festival information</p>
                <p>📍 <a href="<?php echo $base_url; ?>/festival-info.php" target="_blank"><?php echo $base_url; ?>/festival-info.php</a></p>
            </div>

            <div class="endpoint">
                <h3><span class="method">GET</span>/api/schedule.php?day=saturday</h3>
                <p>Returns artists/performers for selected day</p>
                <p>Parameters:</p>
                <ul style="margin: 10px 0 10px 20px;">
                    <li><code>day</code> - saturday or sunday</li>
                </ul>
                <p>📍 <a href="<?php echo $base_url; ?>/schedule.php?day=saturday" target="_blank"><?php echo $base_url; ?>/schedule.php?day=saturday</a></p>
                <p>📍 <a href="<?php echo $base_url; ?>/schedule.php?day=sunday" target="_blank"><?php echo $base_url; ?>/schedule.php?day=sunday</a></p>
            </div>

            <div class="endpoint">
                <h3><span class="method">GET</span>/api/locations.php</h3>
                <p>Returns festival location markers for the map</p>
                <p>📍 <a href="<?php echo $base_url; ?>/locations.php" target="_blank"><?php echo $base_url; ?>/locations.php</a></p>
            </div>

            <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">

            <h2 style="color: #247BA0; margin: 30px 0 20px;">Color Scheme</h2>
            <div class="colors">
                <div class="color-box" style="background: #F03228;">
                    Vermilion<span>#F03228</span>
                </div>
                <div class="color-box" style="background: #247BA0;">
                    Cerulean<span>#247BA0</span>
                </div>
                <div class="color-box" style="background: #E3B505;">
                    Saffron<span>#E3B505</span>
                </div>
                <div class="color-box" style="background: #000000;">
                    Black<span>#000000</span>
                </div>
                <div class="color-box" style="background: #FFFFFF; color: #000; border: 1px solid #ddd;">
                    White<span>#FFFFFF</span>
                </div>
            </div>

            <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">

            <h2 style="color: #247BA0; margin: 30px 0 20px;">Quick Start</h2>
            <p>1. Set up the MySQL database: <code>mysql -u root -p < database/schema.sql</code></p>
            <p>2. Configure PHP: Edit <code>api/config.php</code> with your database credentials</p>
            <p>3. Install React dependencies: <code>npm install</code></p>
            <p>4. Start development: <code>npm run dev</code></p>
            <p>5. Access the app at <code>http://localhost:5173</code></p>

            <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">

            <p style="color: #999; font-size: 0.9em; text-align: center; margin-top: 30px;">
                Festival App v1.0.0 | May 2024
            </p>
        </div>
    </div>
</body>
</html>
