import ClassDetailPageContent from '@/components/features/mentor/pages/ClassDetailPageContent'

export default async function ClassDetailPage({ params }: { params: Promise<{ class_id: string }> }) {
    const { class_id } = await params
    return <ClassDetailPageContent classId={class_id} />
}
