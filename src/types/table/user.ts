export type UserType = 'GENERAL' | 'STUDENT' | 'TEACHER' | 'ADMIN'

export type UsersTableType = {
    id: string
    last_name: string | null
    first_name: string
    email: string
    user_type: UserType
    grade: number | null
    class_no: number | null
    student_no: number | null
    school: string | null
    created_at: string
    updated_at: string
    last_login_at: string | null
}
