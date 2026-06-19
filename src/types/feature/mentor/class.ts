export type ClassItem = {
  id: string
  name: string
  grade: string
  studentCount: number
  description?: string
  createdAt: string
  updatedAt: string
}

export type StudentInClass = {
  id: string
  name: string
  studentNumber: string
  grade: string
  className: string
  email?: string
  lastLoginAt?: string
  createdAt: string
  dreamMatchResults?: {
    topJobCategories: { name: string; count: number }[]
    matchedJobs: { id: string; name: string; score: number }[]
    interestTags: string[]
  }
}

export type ClassStats = {
  classId: string
  className: string
  topJobCategories: { name: string; count: number; color: string }[]
  dreamActionStatus: {
    total: number
    generated: number
    distributed: number
    pending: number
  }
  avgMatchScore: number
}
