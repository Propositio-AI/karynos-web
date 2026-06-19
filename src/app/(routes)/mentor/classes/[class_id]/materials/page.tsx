import MaterialFolderPageContent from '@/components/features/mentor/pages/MaterialFolderPageContent'

export default async function MaterialsPage({ params }: { params: Promise<{ class_id: string }> }) {
    const { class_id } = await params
    return <MaterialFolderPageContent classId={class_id} />
}
