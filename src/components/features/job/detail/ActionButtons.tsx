import { HorizontalStackContainer } from "@/components/ui/molecules/Container"
import { BaseButton } from "@/components/ui/atoms/Button"

type ActionButtonsProps = {
    jobId: number
    onChatClick: () => void
    isCreatingChat: boolean
}

export const ActionButtons = ({ jobId, onChatClick, isCreatingChat }: ActionButtonsProps) => {
    return (
        <HorizontalStackContainer space={4} className="justify-center">
            <BaseButton 
                color="white" 
                className="px-8 py-3"
                onClick={onChatClick}
                isLoading={isCreatingChat}
            >
                チャットで相談
            </BaseButton>
        </HorizontalStackContainer>
    )
}
