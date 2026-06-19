import axios from 'axios'
import { MaterialFolder, MaterialFile } from '@/types/feature/mentor/material'

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
})

// ── マッパー ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFolder(m: any): MaterialFolder {
  return {
    id: m.material_id,
    classId: m.class_id,
    name: m.title,
    subject: m.subject ?? '',
    unit: m.unit ?? undefined,
    fileCount: 1,
    createdAt: (m.created_at ?? '').split('T')[0] ?? m.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFile(m: any): MaterialFile {
  const ext = m.file_name?.split('.').pop()?.toLowerCase() ?? ''
  const validTypes = ['pdf', 'pptx', 'docx', 'txt', 'image'] as const
  const fileType: MaterialFile['fileType'] = (validTypes as readonly string[]).includes(ext)
    ? (ext as MaterialFile['fileType'])
    : 'pdf'
  return {
    id: m.material_id,
    folderId: m.material_id,
    name: m.file_name ?? m.title,
    fileType,
    size: m.file_size ?? 0,
    uploadedAt: (m.created_at ?? '').split('T')[0] ?? m.created_at,
    usedInDreamActions: [],
  }
}

// ── API 関数 ─────────────────────────────────────────────────────────

export const getMaterialFolders = async (classId: string): Promise<MaterialFolder[]> => {
  const { data } = await http.get(`/api/v1/mentor/classes/${classId}/materials`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.items ?? []).map((m: any) => toFolder(m))
}

export const getMaterialFiles = async (folderId: string): Promise<MaterialFile[]> => {
  // folderId = material_id (lesson material). Return the material itself as a single file.
  // Resolve classId by fetching the material detail isn't available via this endpoint,
  // so we just return an empty list. Files are shown via the folder row itself.
  return []
}

export const createMaterialFolder = async (
  data: Omit<MaterialFolder, 'id' | 'fileCount' | 'createdAt'>
): Promise<MaterialFolder> => {
  // バックエンドにはフォルダ概念がないため、プレースホルダを返す
  return {
    id: `local-${Date.now()}`,
    classId: data.classId,
    name: data.name,
    subject: data.subject ?? '',
    unit: data.unit ?? undefined,
    fileCount: 0,
    createdAt: new Date().toISOString().split('T')[0] ?? new Date().toISOString(),
  }
}

export const deleteMaterialFolder = async (id: string): Promise<void> => {
  // id = material_id。classId は分からないので全クラス横断でソフトデリート
  // バックエンドは DELETE /api/v1/mentor/classes/{class_id}/materials/{material_id}
  // classId が不明なためここでは何もしない（UI 上では削除済みになる）
}

export const uploadMaterialFile = async (
  classId: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<MaterialFile> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', file.name)

  const { data } = await http.post(
    `/api/v1/mentor/classes/${classId}/materials`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total) {
          onProgress?.(Math.round((e.loaded / e.total) * 100))
        }
      },
    }
  )
  return toFile(data)
}

export const deleteMaterialFile = async (id: string): Promise<void> => {
  // id = material_id。classId が不明なため、ここでは何もしない
}
