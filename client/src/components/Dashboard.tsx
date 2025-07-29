import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from './FileUpload';
import FileList from './FileList';
import Sidebar from './Sidebar';
import Header from './Header';
import { FileItem, Folder } from '../types';
import { fileService } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadFiles();
    loadFolders();
  }, [currentPath]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fileService.getFiles(currentPath);
      setFiles(response.files);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des fichiers');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await fileService.getFolders(currentPath);
      setFolders(response.folders);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des dossiers');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await fileService.uploadFile(file, currentPath);
      toast.success('Fichier uploadé avec succès !');
      loadFiles(); // Recharger la liste des fichiers
      setShowUpload(false);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de l\'upload';
      toast.error(message);
    }
  };

  const handleFileDelete = async (fileId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      try {
        await fileService.deleteFile(fileId);
        toast.success('Fichier supprimé avec succès !');
        loadFiles();
      } catch (error: any) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleFileDownload = async (fileId: number, fileName: string) => {
    try {
      const response = await fileService.downloadFile(fileId);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Téléchargement démarré !');
    } catch (error: any) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      await fileService.createFolder(name, currentPath);
      toast.success('Dossier créé avec succès !');
      loadFolders();
    } catch (error: any) {
      toast.error('Erreur lors de la création du dossier');
    }
  };

  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
  };

  const navigateUp = () => {
    if (currentPath !== '/') {
      const pathParts = currentPath.split('/').filter(Boolean);
      pathParts.pop();
      const newPath = pathParts.length > 0 ? '/' + pathParts.join('/') : '/';
      setCurrentPath(newPath);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        onUploadClick={() => setShowUpload(true)}
        onCreateFolder={handleCreateFolder}
      />
      
      <div className="flex">
        <Sidebar 
          currentPath={currentPath}
          folders={folders}
          onNavigate={navigateToFolder}
          onNavigateUp={navigateUp}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Path breadcrumb */}
            <div className="mb-6">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <button
                      onClick={() => setCurrentPath('/')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Accueil
                    </button>
                  </li>
                  {currentPath !== '/' && currentPath.split('/').filter(Boolean).map((part, index, arr) => (
                    <li key={index} className="flex items-center">
                      <span className="mx-2 text-gray-400">/</span>
                      <button
                        onClick={() => {
                          const pathToNavigate = '/' + arr.slice(0, index + 1).join('/');
                          setCurrentPath(pathToNavigate);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {part}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* File Upload Modal */}
            {showUpload && (
              <FileUpload
                onUpload={handleFileUpload}
                onClose={() => setShowUpload(false)}
              />
            )}

            {/* Files and Folders */}
            <FileList
              files={files}
              folders={folders}
              isLoading={isLoading}
              onFileDelete={handleFileDelete}
              onFileDownload={handleFileDownload}
              onFolderNavigate={navigateToFolder}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
