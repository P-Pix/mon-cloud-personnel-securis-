import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/zip': ['.zip'],
      'video/*': ['.mp4', '.avi', '.mov'],
      'audio/*': ['.mp3', '.wav', '.ogg']
    }
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simuler un progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Fermer la modal après un court délai
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('zip')) return '📦';
    return '📄';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Uploader un fichier
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Upload Area */}
        {!selectedFile && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-primary-600 font-medium">
                Déposez votre fichier ici...
              </p>
            ) : (
              <>
                <p className="text-gray-600 mb-2">
                  Glissez-déposez votre fichier ici, ou{' '}
                  <span className="text-primary-600 font-medium">cliquez pour parcourir</span>
                </p>
                <p className="text-sm text-gray-500">
                  Formats supportés: Images, PDF, Documents, Vidéos, Audio, ZIP
                </p>
                <p className="text-sm text-gray-500">
                  Taille maximale: 100 MB
                </p>
              </>
            )}
          </div>
        )}

        {/* File Rejections */}
        {fileRejections.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Fichier rejeté</span>
            </div>
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name} className="mt-2 text-sm text-red-700">
                <p className="font-medium">{file.name}</p>
                {errors.map(error => (
                  <p key={error.code} className="text-red-600">
                    {error.code === 'file-too-large' && 'Fichier trop volumineux (max 100MB)'}
                    {error.code === 'file-invalid-type' && 'Type de fichier non supporté'}
                    {error.code === 'too-many-files' && 'Un seul fichier à la fois'}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Selected File */}
        {selectedFile && (
          <div className="mb-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">{getFileIcon(selectedFile.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              {uploadProgress === 100 && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Upload en cours...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={isUploading || uploadProgress === 100}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Upload...' : uploadProgress === 100 ? 'Terminé !' : 'Uploader'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
