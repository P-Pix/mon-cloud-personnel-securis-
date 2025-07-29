import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Cloud, Upload, FolderPlus, LogOut, User } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
  onUploadClick: () => void;
  onCreateFolder: (name: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onUploadClick, onCreateFolder }) => {
  const { logout } = useAuth();
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      setFolderName('');
      setShowFolderDialog(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Mon Cloud Sécurisé</h1>
                <p className="text-sm text-gray-500">Stockage personnel et sécurisé</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Upload Button */}
              <button
                onClick={onUploadClick}
                className="btn-primary flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Uploader</span>
              </button>

              {/* Create Folder Button */}
              <button
                onClick={() => setShowFolderDialog(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Nouveau dossier</span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Create Folder Dialog */}
      {showFolderDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Créer un nouveau dossier
            </h3>
            
            <div className="mb-4">
              <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du dossier
              </label>
              <input
                type="text"
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="input-field"
                placeholder="Mon nouveau dossier"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowFolderDialog(false);
                  setFolderName('');
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!folderName.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
