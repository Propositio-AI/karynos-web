import DreamActionDetailPageContent from '@/components/features/dream-action/pages/DreamActionDetailPageContent'

export default function DreamActionDetailPage({
    params,
}: {
    params: Promise<{ material_id: string }>
}) {
    return <DreamActionDetailPageContent params={params} />
}
