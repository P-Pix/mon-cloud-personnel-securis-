require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Config base de données MySQL (adapter .env ou valeurs par défaut)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql_db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'moncloud',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Secret JWT (mettre dans .env)
const JWT_SECRET = process.env.JWT_SECRET || 'monsecretjwt';

// Middleware d’authentification JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Token manquant');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Token invalide');
    req.user = user;
    next();
  });
}

// Route test base MySQL
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.send(`Résultat : ${rows[0].result}`);
  } catch (err) {
    console.error('Erreur base de données:', err);
    res.status(500).send('Erreur base de données');
  }
});

// Inscription utilisateur
app.post('/users/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Champs manquants');

  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    res.status(201).send('Utilisateur créé');
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).send('Nom d’utilisateur déjà pris');
    res.status(500).send('Erreur serveur');
  }
});

// Login utilisateur => JWT
app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Champs manquants');

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).send('Utilisateur non trouvé');

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Mot de passe incorrect');

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// --- Routes movies CRUD ---

// Créer un film (auth requis)
app.post('/movies', authenticateToken, async (req, res) => {
  const { title, description, year } = req.body;
  if (!title || !year) return res.status(400).send('Titre et année obligatoires');

  try {
    const [result] = await pool.query(
      'INSERT INTO movies (title, description, year) VALUES (?, ?, ?)',
      [title, description || '', year]
    );
    res.status(201).send({ id: result.insertId, title, description, year });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Lister tous les films (auth requis)
app.get('/movies', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Récupérer un film par id (auth requis)
app.get('/movies/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).send('Film non trouvé');
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Modifier un film (auth requis)
app.put('/movies/:id', authenticateToken, async (req, res) => {
  const { title, description, year } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE movies SET title = ?, description = ?, year = ? WHERE id = ?',
      [title, description, year, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).send('Film non trouvé');
    res.send('Film modifié');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Supprimer un film (auth requis)
app.delete('/movies/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).send('Film non trouvé');
    res.send('Film supprimé');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend Plex-like lancé sur le port ${PORT}`);
});
