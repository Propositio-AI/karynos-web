export type QueryType = 'TEXTBOOK' | 'CHAT'

export type QueryTableType = {
    id: string
    user_id: string
    parent_id: string | null
    query: string
    query_type: QueryType
    favorite: boolean
    created_at: string
    updated_at: string
}
