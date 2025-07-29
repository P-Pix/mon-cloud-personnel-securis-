export interface User {
  id: number;
  username: string;
  email: string;
}

export interface FileItem {
  id: number;
  original_name: string;
  file_size: number;
  mime_type: string;
  folder_path: string;
  created_at: string;
}

export interface Folder {
  id: number;
  name: string;
  path: string;
  parent_path: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface FileUploadResponse {
  message: string;
  file: {
    id: number;
    originalName: string;
    size: number;
    mimeType: string;
    folderPath: string;
    uploadedAt: string;
  };
}

export interface FilesResponse {
  files: FileItem[];
}

export interface FoldersResponse {
  folders: Folder[];
}
