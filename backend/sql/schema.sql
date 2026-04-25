-- ============================================
-- NextRoute Database Schema
-- Run: mysql -u root -p nextroute_db < schema.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS nextroute_db;
USE nextroute_db;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    text VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Destinations (Must Visit + Special Offers)
CREATE TABLE IF NOT EXISTS destinations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    description VARCHAR(255),
    full_details TEXT,
    price VARCHAR(20),
    type ENUM('MUST_VISIT', 'SPECIAL_OFFER') NOT NULL,
    image_urls JSON,
    nights INT DEFAULT 0,
    old_price INT DEFAULT 0,
    new_price INT DEFAULT 0,
    offer_details VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Travel Packages (per destination)
CREATE TABLE IF NOT EXISTS packages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    destination_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    nights INT NOT NULL,
    color VARCHAR(20) DEFAULT 'blue',
    is_popular BOOLEAN DEFAULT FALSE,
    features JSON,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    destination VARCHAR(100) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE,
    persons INT NOT NULL,
    package_name VARCHAR(100),
    total_price INT NOT NULL,
    status ENUM('CONFIRMED', 'CANCELLED') DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_role ENUM('USER', 'ADMIN') NOT NULL,
    room_id VARCHAR(100) NOT NULL,
    message VARCHAR(500) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_destinations_type ON destinations(type, is_active);
CREATE INDEX idx_packages_dest ON packages(destination_name, is_active);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_chat_room ON chat_messages(room_id, sent_at);
