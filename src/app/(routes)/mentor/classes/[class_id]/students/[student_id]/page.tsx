import StudentDetailPageContent from '@/components/features/mentor/pages/StudentDetailPageContent'

export default async function StudentDetailPage({
    params,
}: {
    params: Promise<{ class_id: string; student_id: string }>
}) {
    const { class_id, student_id } = await params
    return <StudentDetailPageContent classId={class_id} studentId={student_id} />
}
