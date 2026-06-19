import DreamActionClassPageContent from '@/components/features/mentor/pages/DreamActionClassPageContent'

export default async function DreamActionClassPage({ params }: { params: Promise<{ class_id: string }> }) {
    const { class_id } = await params
    return <DreamActionClassPageContent classId={class_id} />
}
