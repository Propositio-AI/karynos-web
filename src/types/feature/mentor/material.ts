export type MaterialFolder = {
  id: string
  name: string
  subject: string
  unit?: string
  fileCount: number
  classId: string
  createdAt: string
}

export type MaterialFile = {
  id: string
  folderId: string
  name: string
  fileType: 'pdf' | 'pptx' | 'docx' | 'txt' | 'image'
  size: number
  uploadedAt: string
  usedInDreamActions?: string[]
}

export type UploadState = 'idle' | 'uploading' | 'success' | 'error'
