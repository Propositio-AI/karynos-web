import { CenterContainer } from "@/components/ui/molecules/Container";

export default function MatchLoadingContent() {
	return (
		<CenterContainer className="min-h-[calc(100vh-6rem)] w-full bg-canvas px-6">
			<div className="rounded-lg border border-line bg-surface px-6 py-5 text-sm font-bold text-muted shadow-soft">
				読み込み中...
			</div>
		</CenterContainer>
	);
}
