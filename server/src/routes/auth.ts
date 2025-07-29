import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init';

const router = express.Router();

// Inscription
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    db.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email],
      async (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur de base de données' });
        }

        if (row) {
          return res.status(409).json({ error: 'Nom d\'utilisateur ou email déjà utilisé' });
        }

        // Hasher le mot de passe
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Créer l'utilisateur
        db.run(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, passwordHash],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
            }

            const userId = this.lastID;

            // Générer le token JWT
            const token = jwt.sign(
              { id: userId, username, email },
              process.env.JWT_SECRET || 'your-secret-key',
              { expiresIn: '7d' }
            );

            res.status(201).json({
              message: 'Utilisateur créé avec succès',
              token,
              user: { id: userId, username, email }
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Connexion
router.post('/login', [
  body('username').notEmpty().withMessage('Nom d\'utilisateur requis'),
  body('password').notEmpty().withMessage('Mot de passe requis')
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Trouver l'utilisateur
    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username],
      async (err, user: any) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur de base de données' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Identifiants invalides' });
        }

        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Identifiants invalides' });
        }

        // Générer le token JWT
        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        res.json({
          message: 'Connexion réussie',
          token,
          user: { id: user.id, username: user.username, email: user.email }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
