CREATE DATABASE IF NOT EXISTS mon_app;
USE mon_app;

-- Utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- prévoir un hash côté app
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des catégories de média (ex: Film, Série, Documentaire, Musique, ...)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Table des médias (films, séries, etc.)
CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    release_year YEAR,
    cover_image VARCHAR(512), -- URL ou chemin vers l'affiche
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Table spécifique aux séries (infos supplémentaires)
CREATE TABLE IF NOT EXISTS series (
    media_id INT PRIMARY KEY, -- media.id
    seasons INT DEFAULT 0,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- Table épisodes (liés à une série)
CREATE TABLE IF NOT EXISTS episodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    series_id INT NOT NULL,
    season INT NOT NULL,
    episode_number INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    release_date DATE,
    video_url VARCHAR(512), -- chemin ou URL du fichier vidéo
    FOREIGN KEY (series_id) REFERENCES series(media_id) ON DELETE CASCADE,
    UNIQUE(series_id, season, episode_number)
);

-- Table des films (liés à media de catégorie Film)
CREATE TABLE IF NOT EXISTS movies (
    media_id INT PRIMARY KEY,
    video_url VARCHAR(512),
    duration INT, -- durée en minutes
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- Table des playlists (bibliothèques personnelles, créées par utilisateurs)
CREATE TABLE IF NOT EXISTS playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des éléments dans les playlists (ordre + média)
CREATE TABLE IF NOT EXISTS playlist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT NOT NULL,
    media_id INT NOT NULL,
    position INT DEFAULT 0,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- Initialisation : catégories standards
INSERT IGNORE INTO categories (name) VALUES
('Film'), ('Série'), ('Documentaire'), ('Musique');

-- Exemple d'utilisateur admin (en clair pour test, à hash côté app)
INSERT INTO users (username, password, is_admin) VALUES
('admin', 'admin', TRUE)
ON DUPLICATE KEY UPDATE password = 'admin';
