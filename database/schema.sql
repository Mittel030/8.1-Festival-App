-- Festival App Database Schema

CREATE DATABASE IF NOT EXISTS festival_app;
USE festival_app;

-- Featured Content
CREATE TABLE featured (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date VARCHAR(100),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Festival Information
CREATE TABLE festival_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    location VARCHAR(255),
    dates VARCHAR(100),
    tickets VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Schedule/Artists
CREATE TABLE schedule (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    day ENUM('saturday', 'sunday') NOT NULL,
    time TIME NOT NULL,
    stage VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_day (day)
);

-- Festival Locations
CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data

INSERT INTO featured (title, description, date, location) VALUES 
('Welcome to U Festival', 'Join us for an unforgettable festival experience with amazing artists and entertainment.', 'June 15-16, 2024', 'Utrecht, Netherlands');

INSERT INTO festival_info (title, description, location, dates, tickets) VALUES 
('Festival Information', 'Lorem ipsum dolor ant sam. consectetur adipiscing elit. Aliquam at euam festde ut-elegant, elenendi les risus.\n\nLorem ipsum dolor ant sam. consectetur adipiscing elit. Aliquam at euavi festa ut-elegant, elenendi les risus.\n\nLorem ipsum dolor ant sam. consectetur adipiscing elit. Aliquam at euavi festa ut-elegant, elenendi les risus.', 'Utrecht, Netherlands', 'June 15-16, 2024', 'Available online');

INSERT INTO schedule (name, day, time, stage) VALUES 
('Opening with DJ Collective', 'saturday', '12:00:00', 'Main Stage'),
('Studentenclub Showcase', 'saturday', '14:30:00', 'Side Stage'),
('Wetenschapsquiz Live', 'saturday', '16:15:00', 'Brain Dome'),
('Headliner: Dutch Talent Show', 'saturday', '20:30:00', 'Main Stage'),
('Morning Acoustic Sessions', 'sunday', '11:30:00', 'River Side'),
('Theater Performances', 'sunday', '13:30:00', 'Campus Court'),
('Community Event', 'sunday', '17:00:00', 'Flow Area'),
('Closing Lights & Beats', 'sunday', '21:00:00', 'Main Stage');

INSERT INTO locations (name, type, latitude, longitude) VALUES 
('Main Stage', 'Stage', 52.07280000, 5.05580000),
('Food Court', 'Food', 52.07320000, 5.05650000),
('Info Booth', 'Info', 52.07220000, 5.05630000),
('Side Stage', 'Stage', 52.07250000, 5.05510000);
