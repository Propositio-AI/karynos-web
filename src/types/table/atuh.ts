export type AuthTableType = {
    id: string
    email: string
    token: string
    created_at: string
    expires_at: string
    used_at: string | null
}

export type RefreshTableType = {
    id: string
    token: string
    created_at: string
    expires_at: string
    used_at: string | null
}
