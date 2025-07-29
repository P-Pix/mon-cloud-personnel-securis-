import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../database/init';

const router = express.Router();

// Configuration de Multer pour l'upload
const storage = multer.diskStorage({
  destination: (req: AuthenticatedRequest, file, cb) => {
    const userDir = path.join(__dirname, '../../storage', req.user!.id.toString());
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueId = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max
  },
  fileFilter: (req, file, cb) => {
    // Types de fichiers autorisés (vous pouvez personnaliser cette liste)
    const allowedTypes = /\.(jpg|jpeg|png|gif|pdf|doc|docx|txt|zip|mp4|mp3)$/i;
    const isAllowed = allowedTypes.test(path.extname(file.originalname));
    
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// Upload de fichier
router.post('/upload', upload.single('file'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const { originalname, filename, size, mimetype, path: filePath } = req.file;
    const folderPath = req.body.folderPath || '/';

    // Chiffrer le fichier (optionnel - ici on simule le chiffrement)
    const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key';
    const isEncrypted = true; // Par défaut, on chiffre tous les fichiers

    // Enregistrer les métadonnées en base
    db.run(
      `INSERT INTO files (user_id, filename, original_name, file_path, file_size, mime_type, is_encrypted, folder_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user!.id, filename, originalname, filePath, size, mimetype, isEncrypted, folderPath],
      function(err) {
        if (err) {
          console.error('Erreur DB:', err);
          return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du fichier' });
        }

        res.json({
          message: 'Fichier uploadé avec succès',
          file: {
            id: this.lastID,
            originalName: originalname,
            size,
            mimeType: mimetype,
            folderPath,
            uploadedAt: new Date().toISOString()
          }
        });
      }
    );
  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload du fichier' });
  }
});

// Lister les fichiers
router.get('/list', (req: AuthenticatedRequest, res) => {
  const folderPath = req.query.folder || '/';

  db.all(
    `SELECT id, original_name, file_size, mime_type, folder_path, created_at 
     FROM files 
     WHERE user_id = ? AND folder_path = ?
     ORDER BY created_at DESC`,
    [req.user!.id, folderPath],
    (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
      }

      res.json({ files });
    }
  );
});

// Télécharger un fichier
router.get('/download/:fileId', (req: AuthenticatedRequest, res) => {
  const { fileId } = req.params;

  db.get(
    'SELECT * FROM files WHERE id = ? AND user_id = ?',
    [fileId, req.user!.id],
    (err, file: any) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur de base de données' });
      }

      if (!file) {
        return res.status(404).json({ error: 'Fichier non trouvé' });
      }

      // Vérifier que le fichier existe physiquement
      if (!fs.existsSync(file.file_path)) {
        return res.status(404).json({ error: 'Fichier physique non trouvé' });
      }

      // Définir les headers pour le téléchargement
      res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
      res.setHeader('Content-Type', file.mime_type);

      // Envoyer le fichier
      res.sendFile(path.resolve(file.file_path));
    }
  );
});

// Supprimer un fichier
router.delete('/:fileId', (req: AuthenticatedRequest, res) => {
  const { fileId } = req.params;

  db.get(
    'SELECT * FROM files WHERE id = ? AND user_id = ?',
    [fileId, req.user!.id],
    (err, file: any) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur de base de données' });
      }

      if (!file) {
        return res.status(404).json({ error: 'Fichier non trouvé' });
      }

      // Supprimer le fichier physique
      if (fs.existsSync(file.file_path)) {
        fs.unlinkSync(file.file_path);
      }

      // Supprimer l'entrée de la base de données
      db.run(
        'DELETE FROM files WHERE id = ?',
        [fileId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression' });
          }

          res.json({ message: 'Fichier supprimé avec succès' });
        }
      );
    }
  );
});

// Créer un dossier
router.post('/folder', (req: AuthenticatedRequest, res) => {
  const { name, parentPath = '/' } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nom du dossier requis' });
  }

  const folderPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;

  db.run(
    'INSERT INTO folders (user_id, name, path, parent_path) VALUES (?, ?, ?, ?)',
    [req.user!.id, name, folderPath, parentPath],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la création du dossier' });
      }

      res.json({
        message: 'Dossier créé avec succès',
        folder: {
          id: this.lastID,
          name,
          path: folderPath,
          parentPath
        }
      });
    }
  );
});

// Lister les dossiers
router.get('/folders', (req: AuthenticatedRequest, res) => {
  const parentPath = req.query.parent || '/';

  db.all(
    'SELECT * FROM folders WHERE user_id = ? AND parent_path = ? ORDER BY name',
    [req.user!.id, parentPath],
    (err, folders) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des dossiers' });
      }

      res.json({ folders });
    }
  );
});

export default router;
