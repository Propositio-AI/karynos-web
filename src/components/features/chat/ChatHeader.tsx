import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
    title: string;
};

export const ChatHeader = ({ title }: Props) => {
    const router = useRouter();

    return (
        <header className="fixed left-0 top-0 z-30 flex h-16 w-full items-center border-b border-line bg-surface/95 px-4 shadow-sm backdrop-blur">
            <div className="mx-auto flex w-full max-w-3xl items-center">
                <button
                    onClick={() => router.back()}
                    className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg text-ink transition hover:bg-brand-50"
                    aria-label="戻る"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                    <p className="text-xs font-bold text-subtle">Career chat</p>
                    <h1 className="truncate text-base font-extrabold text-ink sm:text-lg">
                        {title || "チャット"}
                    </h1>
                </div>
            </div>
        </header>
    );
};
