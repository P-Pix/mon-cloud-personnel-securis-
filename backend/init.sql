CREATE DATABASE IF NOT EXISTS mon_app;

USE mon_app;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Ajouter un utilisateur admin/admin (mot de passe hashé si possible, ici en clair pour test)
INSERT INTO users (username, password)
VALUES ('admin', 'admin')
ON DUPLICATE KEY UPDATE password = 'admin';
