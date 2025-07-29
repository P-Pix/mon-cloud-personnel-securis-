import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/auth';
import fileRoutes from './routes/files';
import { authenticateToken } from './middleware/auth';
import { initDatabase } from './database/init';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes par IP
  message: 'Trop de requêtes depuis cette IP, réessayez plus tard.'
});
app.use(limiter);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Créer le dossier de stockage s'il n'existe pas
const storageDir = path.join(__dirname, '../storage');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', authenticateToken, fileRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gestion des erreurs globales
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Initialisation de la base de données et démarrage du serveur
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📁 Dossier de stockage: ${storageDir}`);
  });
}).catch((error) => {
  console.error('Erreur lors de l\'initialisation de la base de données:', error);
  process.exit(1);
});

export default app;
