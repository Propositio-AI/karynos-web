import { BaseButton } from "@/components/ui/atoms/Button";

type ActionButtonsProps = {
    jobId: number;
    onChatClick: () => void;
    isCreatingChat: boolean;
};

export const ActionButtons = ({ onChatClick, isCreatingChat }: ActionButtonsProps) => {
    return (
        <div className="fixed inset-x-0 bottom-16 z-40 border-t border-line bg-surface/95 px-4 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-2xl gap-3">
                <BaseButton
                    color="emerald"
                    className="w-full"
                    onClick={onChatClick}
                    isLoading={isCreatingChat}
                >
                    チャットで相談
                </BaseButton>
            </div>
        </div>
    );
};
