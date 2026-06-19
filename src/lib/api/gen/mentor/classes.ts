import axios from 'axios'
import { ClassItem, StudentInClass, ClassStats } from '@/types/feature/mentor/class'

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
})

// ── マッパー ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toClassItem(c: any): ClassItem {
  return {
    id: c.class_id,
    name: c.name,
    grade: c.academic_year ? `${c.academic_year}年度` : '',
    studentCount: c.enrolled_count ?? 0,
    description: c.description ?? undefined,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toStudent(s: any, cls?: ClassItem): StudentInClass {
  return {
    id: s.dreamer_id,
    name: s.name ?? `${s.name_family ?? ''} ${s.name_given ?? ''}`.trim(),
    studentNumber: '',
    grade: cls?.grade ?? '',
    className: cls?.name ?? '',
    email: s.email ?? undefined,
    lastLoginAt: s.last_login_at ?? undefined,
    createdAt: s.enrolled_at ?? s.created_at ?? '',
    dreamMatchResults: s.top_job_categories
      ? {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          topJobCategories: (s.top_job_categories ?? []).map((j: any) => ({
            name: j.name,
            count: j.count,
          })),
          matchedJobs: [],
          interestTags: [],
        }
      : undefined,
  }
}

// ── API 関数 ─────────────────────────────────────────────────────────

export const getClasses = async (): Promise<ClassItem[]> => {
  const { data } = await http.get('/api/v1/mentor/classes')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.items ?? []).map((c: any) => toClassItem(c))
}

export const getClassById = async (classId: string): Promise<ClassItem> => {
  const { data } = await http.get(`/api/v1/mentor/classes/${classId}`)
  return toClassItem(data)
}

export const getStudentsInClass = async (classId: string): Promise<StudentInClass[]> => {
  const [studentsRes, classRes] = await Promise.all([
    http.get(`/api/v1/mentor/classes/${classId}/students`),
    http.get(`/api/v1/mentor/classes/${classId}`),
  ])
  const cls = toClassItem(classRes.data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (studentsRes.data.items ?? []).map((s: any) => toStudent(s, cls))
}

export const getStudentById = async (
  classId: string,
  dreamerId: string
): Promise<StudentInClass> => {
  const [studentRes, classRes] = await Promise.all([
    http.get(`/api/v1/mentor/classes/${classId}/students/${dreamerId}`),
    http.get(`/api/v1/mentor/classes/${classId}`),
  ])
  return toStudent(studentRes.data, toClassItem(classRes.data))
}

export const getClassStats = async (classId: string): Promise<ClassStats> => {
  const [analyticsRes, classRes] = await Promise.all([
    http.get(`/api/v1/mentor/classes/${classId}/analytics`),
    http.get(`/api/v1/mentor/classes/${classId}`),
  ])
  const a = analyticsRes.data
  const cls = toClassItem(classRes.data)
  return {
    classId,
    className: cls.name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    topJobCategories: (a.top_job_categories ?? []).map((j: any, i: number) => ({
      name: j.name,
      count: j.count,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
    })),
    dreamActionStatus: {
      total: a.generated_materials_count ?? 0,
      generated: a.pending_review_count ?? 0,
      distributed: a.distributed_materials_count ?? 0,
      pending: Math.max(
        0,
        (a.generated_materials_count ?? 0) -
          (a.distributed_materials_count ?? 0) -
          (a.pending_review_count ?? 0)
      ),
    },
    avgMatchScore: 0,
  }
}

export const getAllClassStats = async (): Promise<ClassStats[]> => {
  const classes = await getClasses()
  return Promise.all(classes.map((c) => getClassStats(c.id)))
}
