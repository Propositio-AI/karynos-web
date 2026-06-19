import axios from 'axios'
import {
  DreamActionMaterial,
  DreamActionBatch,
  DreamActionStatus,
  DreamerDreamActionMaterial,
} from '@/types/feature/dream-action/dreamAction'

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
})

// バックエンドステータス → フロントエンドステータス
function toStatus(backendStatus: string): DreamActionStatus {
  if (backendStatus === 'DISTRIBUTED') return 'distributed'
  if (backendStatus === 'DRAFT' || backendStatus === 'REVIEWING') return 'completed'
  return 'pending'
}

// title から dreamer名を抽出: "○○ を目指す △△ さんへ（◻◻）"
function extractDreamerName(title: string | null): string {
  if (!title) return '生徒'
  const match = title.match(/を目指す (.+?) さんへ/)
  return match?.[1] ?? '生徒'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMaterial(m: any, classId: string, className = ''): DreamActionMaterial {
  return {
    id: m.generated_material_id,
    classId,
    className,
    dreamerId: m.dreamer_id,
    dreamerName: extractDreamerName(m.title),
    dreamerJob: m.job_name ?? '',
    subject: '',
    unit: '',
    status: toStatus(m.status),
    materialFileId: m.lesson_material_id,
    generatedContent: m.content ?? undefined,
    distributedAt: m.distributed_at ?? undefined,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  }
}

// ── ジョブ ID キャッシュ（generateDreamAction → completeDreamActionBatch 間で保持） ──
const pendingJobs = new Map<string, string>() // classId → generation_job_id

// ── Mentor 向け API ───────────────────────────────────────────────────

export const getDreamActions = async (classId: string): Promise<DreamActionMaterial[]> => {
  const [matsRes, clsRes] = await Promise.all([
    http.get(`/api/v1/mentor/classes/${classId}/dream-action/materials`),
    http.get(`/api/v1/mentor/classes/${classId}`),
  ])
  const className: string = clsRes.data?.name ?? ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (matsRes.data.items ?? []).map((m: any) => toMaterial(m, classId, className))
}

export const generateDreamAction = async (
  classId: string,
  lessonMaterialId: string
): Promise<DreamActionBatch> => {
  const { data } = await http.post(
    `/api/v1/mentor/classes/${classId}/dream-action/generate`,
    { lesson_material_id: lessonMaterialId }
  )
  pendingJobs.set(classId, data.generation_job_id)
  return {
    id: data.generation_job_id,
    classId,
    materialFolderId: lessonMaterialId,
    status: 'generating',
    materials: [],
    createdAt: new Date().toISOString(),
  }
}

export const completeDreamActionBatch = async (
  classId: string
): Promise<DreamActionMaterial[]> => {
  const jobId = pendingJobs.get(classId)
  if (jobId) {
    // 最大 60 秒ポーリング（2 秒間隔 × 30 回）
    for (let i = 0; i < 30; i++) {
      try {
        const { data: job } = await http.get(
          `/api/v1/mentor/classes/${classId}/dream-action/jobs/${jobId}`
        )
        if (job.status === 'COMPLETED' || job.status === 'FAILED') {
          pendingJobs.delete(classId)
          break
        }
      } catch {
        break
      }
      await new Promise((r) => setTimeout(r, 2000))
    }
    pendingJobs.delete(classId)
  }
  return getDreamActions(classId)
}

export const distributeDreamAction = async (
  classId: string,
  materialId: string
): Promise<DreamActionMaterial> => {
  await http.post(`/api/v1/mentor/classes/${classId}/dream-action/distribute`, {
    generated_material_ids: [materialId],
  })
  // 最新状態を取得して返す
  const { data } = await http.get(
    `/api/v1/mentor/classes/${classId}/dream-action/materials/${materialId}`
  )
  return toMaterial(data, classId)
}

export const retryDreamAction = async (
  classId: string,
  materialId: string
): Promise<DreamActionMaterial> => {
  const { data } = await http.post(
    `/api/v1/mentor/classes/${classId}/dream-action/materials/${materialId}/regenerate`
  )
  // 再生成ジョブ開始 → 生成中ステータスで返す
  pendingJobs.set(classId, data.generation_job_id)
  const current = await getDreamActions(classId)
  return (
    current.find((m) => m.id === materialId) ?? {
      id: materialId,
      classId,
      className: '',
      dreamerId: '',
      dreamerName: '生徒',
      dreamerJob: '',
      subject: '',
      unit: '',
      status: 'generating' as DreamActionStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  )
}

// ── Dreamer 向け API ──────────────────────────────────────────────────

export const getDreamerDreamActions = async (
  dreamerId: string
): Promise<DreamActionMaterial[]> => {
  const { data } = await http.get('/api/v1/dream-action/materials')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.items ?? []).map((m: any) => toMaterial(m, ''))
}

export const getDreamerDreamActionMaterials =
  async (): Promise<DreamerDreamActionMaterial[]> => {
    const { data } = await http.get('/api/v1/dream-action/materials')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.items ?? []).map((m: any): DreamerDreamActionMaterial => ({
      id: m.generated_material_id,
      subject: '',
      unit: '',
      dreamerJob: m.job_name ?? '',
      relevanceTitle: m.title ?? '補助教材',
      relevanceContent: m.content ?? '',
      status: m.status === 'DISTRIBUTED' ? 'distributed' : 'read',
      distributedAt: m.distributed_at ?? m.created_at,
      isRead: m.is_read ?? false,
      sourceUnit: '',
    }))
  }

export const getDreamerDreamActionMaterialById = async (
  id: string
): Promise<DreamerDreamActionMaterial> => {
  const { data } = await http.get(`/api/v1/dream-action/materials/${id}`)
  return {
    id: data.generated_material_id,
    subject: '',
    unit: '',
    dreamerJob: data.job_name ?? '',
    relevanceTitle: data.title ?? '補助教材',
    relevanceContent: data.content ?? '',
    status: data.status === 'DISTRIBUTED' ? 'distributed' : 'read',
    distributedAt: data.distributed_at ?? data.created_at,
    isRead: data.is_read ?? false,
    sourceUnit: '',
  }
}

export const markDreamActionAsRead = async (id: string): Promise<void> => {
  await http.patch(`/api/v1/dream-action/materials/${id}/read`)
}
