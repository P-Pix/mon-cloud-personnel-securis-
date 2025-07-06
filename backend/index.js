const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: 'mysql',       // correspond au service mysql dans docker-compose
  user: 'root',
  password: 'monpassword',
  database: 'moncloud',
};

let pool;

async function initDb() {
  pool = await mysql.createPool(dbConfig);
}

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'Missing fields' });

    const hashed = await bcrypt.hash(password, 10);

    const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (rows.length) return res.status(400).json({ error: 'User exists' });

    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);

    res.json({ message: 'User registered' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'Missing fields' });

    const [rows] = await pool.query('SELECT id, password FROM users WHERE username = ?', [username]);
    if (!rows.length) return res.status(400).json({ error: 'User not found' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });

    res.json({ message: 'Login successful' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

initDb().then(() => {
  app.listen(3001, () => {
    console.log('Backend running on http://localhost:3001');
  });
}).catch(err => {
  console.error('DB connection error:', err);
});
