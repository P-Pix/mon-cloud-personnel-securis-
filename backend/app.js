const mysql = require('mysql2');
const express = require('express');
const app = express();

const configDb = {
  host: process.env.DB_HOST || 'mysql_db',  // bien utiliser le nom de service Docker
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'moncloud',
};

let db;

function connectWithRetry() {
  db = mysql.createConnection(configDb);
  db.connect(err => {
    if (err) {
      console.error('Erreur connexion MySQL, nouvelle tentative dans 2 sec:', err.message);
      setTimeout(connectWithRetry, 2000);
    } else {
      console.log('Connecté à MySQL');
    }
  });

  db.on('error', err => {
    console.error('Erreur MySQL (event error):', err.message);
  });
}

connectWithRetry();

app.use(express.json());

app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('Erreur requête MySQL:', err);
      return res.status(500).send('Erreur base de données');
    }
    res.send(`Résultat : ${results[0].result}`);
  });
});

module.exports = app;
