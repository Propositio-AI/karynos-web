import { CenterContainer } from "@/components/ui/molecules/Container";

export default function MatchLoading() {
    return (
        <CenterContainer className="w-full min-h-screen bg-zinc-50">
            <p className="text-zinc-500">読み込み中...</p>
        </CenterContainer>
    );
}
