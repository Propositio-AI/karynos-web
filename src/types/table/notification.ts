export type MailStatus = 'PENDING' | 'SENT' | 'FAILED'

export type MailTableType = {
    id: string
    to_email: string
    title: string
    contents: string | null
    status: MailStatus
    created_at: string
    updated_at: string
}
