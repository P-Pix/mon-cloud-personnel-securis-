import React from 'react';
import { Folder, Home, ChevronUp } from 'lucide-react';
import { Folder as FolderType } from '../types';

interface SidebarProps {
  currentPath: string;
  folders: FolderType[];
  onNavigate: (path: string) => void;
  onNavigateUp: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPath, 
  folders, 
  onNavigate, 
  onNavigateUp 
}) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
        
        {/* Home */}
        <div className="space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              currentPath === '/' 
                ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Accueil</span>
          </button>

          {/* Navigate Up */}
          {currentPath !== '/' && (
            <button
              onClick={onNavigateUp}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ChevronUp className="w-5 h-5" />
              <span>Dossier parent</span>
            </button>
          )}
        </div>

        {/* Current Path */}
        {currentPath !== '/' && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Dossier actuel
            </p>
            <p className="text-sm text-gray-900 break-all">
              {currentPath}
            </p>
          </div>
        )}

        {/* Subfolders */}
        {folders.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Sous-dossiers
            </h3>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => onNavigate(folder.path)}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Folder className="w-4 h-4 text-blue-500" />
                  <span className="truncate">{folder.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Storage Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Stockage</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Utilisé</span>
              <span className="text-gray-900">-- MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-xs text-gray-500">
              Limite: 100 GB
            </p>
          </div>
        </div>

        {/* Help */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Aide</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Glissez-déposez vos fichiers</li>
            <li>• Cliquez pour télécharger</li>
            <li>• Vos données sont chiffrées</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
