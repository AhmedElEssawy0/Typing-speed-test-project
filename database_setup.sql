
-- Typing Speed Game Database Schema


-- Create database
CREATE DATABASE IF NOT EXISTS typing_game_db;
USE typing_game_db;


-- Scores Table

CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level VARCHAR(20) NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    percentage INT NOT NULL,
    date_played DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_level (level),
    INDEX idx_date (date_played),
    CONSTRAINT chk_level CHECK (level IN ('Easy', 'Normal', 'Hard')),
    CONSTRAINT chk_score CHECK (score >= 0),
    CONSTRAINT chk_total CHECK (total > 0),
    CONSTRAINT chk_percentage CHECK (percentage >= 0 AND percentage <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Users Table (Optional - for future enhancement)

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Scores Table (Optional - for future enhancement)

CREATE TABLE IF NOT EXISTS user_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    level VARCHAR(20) NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    percentage INT NOT NULL,
    date_played DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_level (level),
    INDEX idx_date (date_played),
    CONSTRAINT chk_user_level CHECK (level IN ('Easy', 'Normal', 'Hard')),
    CONSTRAINT chk_user_score CHECK (score >= 0),
    CONSTRAINT chk_user_total CHECK (total > 0),
    CONSTRAINT chk_user_percentage CHECK (percentage >= 0 AND percentage <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Leaderboard View

CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    level,
    COUNT(*) as total_games,
    AVG(score) as avg_score,
    AVG(percentage) as avg_percentage,
    MAX(score) as best_score,
    MIN(score) as worst_score,
    MAX(date_played) as last_played
FROM scores
GROUP BY level
ORDER BY avg_percentage DESC;
