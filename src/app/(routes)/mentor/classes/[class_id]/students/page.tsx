import StudentListPageContent from '@/components/features/mentor/pages/StudentListPageContent'

export default async function StudentsPage({ params }: { params: Promise<{ class_id: string }> }) {
    const { class_id } = await params
    return <StudentListPageContent classId={class_id} />
}
