export type DreamActionStatus = 'pending' | 'generating' | 'completed' | 'failed' | 'distributed'

export type DreamerDreamActionMaterial = {
    id: string
    subject: string
    unit: string
    dreamerJob: string
    relevanceTitle: string
    relevanceContent: string
    status: 'distributed' | 'read'
    distributedAt: string
    isRead: boolean
    sourceUnit: string
}

export type DreamActionMaterial = {
  id: string
  classId: string
  className: string
  dreamerId: string
  dreamerName: string
  dreamerJob: string
  subject: string
  unit: string
  status: DreamActionStatus
  materialFileId?: string
  generatedContent?: string
  relevanceExplanation?: string
  distributedAt?: string
  createdAt: string
  updatedAt: string
}

export type DreamActionBatch = {
  id: string
  classId: string
  materialFolderId: string
  status: DreamActionStatus
  materials: DreamActionMaterial[]
  generatedAt?: string
  createdAt: string
}
