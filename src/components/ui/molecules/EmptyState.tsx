import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

type EmptyStateProps = {
    icon?: IconDefinition;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
};

export const EmptyState = ({ icon = faInbox, title, description, action }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <FontAwesomeIcon icon={icon} className="h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
            {description && <p className="text-sm text-zinc-500 mb-4 max-w-xs">{description}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-400 transition-colors cursor-pointer"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};
