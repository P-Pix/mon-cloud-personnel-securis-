import React from 'react';
import { FileItem, Folder } from '../types';
import { 
  Download, 
  Trash2, 
  Folder as FolderIcon, 
  File as FileIcon,
  Image,
  Video,
  Music,
  Archive,
  FileText
} from 'lucide-react';

interface FileListProps {
  files: FileItem[];
  folders: Folder[];
  isLoading: boolean;
  onFileDelete: (fileId: number) => void;
  onFileDownload: (fileId: number, fileName: string) => void;
  onFolderNavigate: (path: string) => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  folders,
  isLoading,
  onFileDelete,
  onFileDownload,
  onFolderNavigate
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="w-6 h-6 text-green-500" />;
    }
    if (mimeType.startsWith('video/')) {
      return <Video className="w-6 h-6 text-red-500" />;
    }
    if (mimeType.startsWith('audio/')) {
      return <Music className="w-6 h-6 text-purple-500" />;
    }
    if (mimeType.includes('pdf')) {
      return <FileText className="w-6 h-6 text-red-600" />;
    }
    if (mimeType.includes('zip') || mimeType.includes('archive')) {
      return <Archive className="w-6 h-6 text-yellow-600" />;
    }
    return <FileIcon className="w-6 h-6 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Chargement...</span>
      </div>
    );
  }

  const hasContent = folders.length > 0 || files.length > 0;

  if (!hasContent) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FolderIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun fichier ou dossier
        </h3>
        <p className="text-gray-500 mb-4">
          Commencez par uploader vos premiers fichiers ou créer un dossier.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Folders */}
      {folders.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Dossiers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="file-card cursor-pointer group"
                onClick={() => onFolderNavigate(folder.path)}
              >
                <div className="flex items-center space-x-3">
                  <FolderIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {folder.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(folder.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {files.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Fichiers</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taille
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.mime_type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.original_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file.mime_type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatFileSize(file.file_size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(file.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onFileDownload(file.id, file.original_name)}
                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Télécharger"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onFileDelete(file.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;
