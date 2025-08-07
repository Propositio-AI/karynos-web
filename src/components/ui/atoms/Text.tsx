import { PagaeTitleType, SectionTitleType, TextContentsType } from "@/types/ui/Atoms"
import { HorizontalStackContainer } from "../molecules/Container"

export const PageTitle = (props: PagaeTitleType) => {
    return(
        <HorizontalStackContainer space="2" className={`my-6 ${props.className}`}>
            <div className="w-6 h-6 bg-black text-white flex items-center justify-center w-fu">
                {props.number}
            </div>
            <h3>{props.title}</h3>
        </HorizontalStackContainer>
    )
}

export const SectionTitle = (props: SectionTitleType) => {
    return(
        <HorizontalStackContainer space="2" className={`my-4 ${props.className}`}>
            <div className="w-7 h-7 bg-blue-700 text-white flex items-center justify-center rounded-full">
                {props.number}
            </div>
            <h4>{props.title}</h4>
        </HorizontalStackContainer>
    )
}

// TOOD: LaTexをコンパイルして貼り付けるようにする
export const TextContents: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => (
    <span className="font-semibold">
        {children}
    </span>
)

export const Bold: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => (
    <span className="font-bold">{children}</span>
);

// 下線
export const Underline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="underline">{children}</span>
);

export const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="py-4">
        {children}
    </div>
);

export const RedText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <span className="text-red-600">{children}</span>;
};

export const BlueText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <span className="text-blue-600">{children}</span>;
};

export const YellowText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <span className="text-yellow-600">{children}</span>;
};

export const RedMarker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <mark className="bg-red-200 p-0.5">{children}</mark>;
};

export const BlueMarker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <mark className="bg-blue-200 p-0.5">{children}</mark>;
};

export const YellowMarker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <mark className="bg-yellow-200 p-0.5">{children}</mark>;
};