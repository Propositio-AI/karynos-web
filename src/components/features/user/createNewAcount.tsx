"use client";

import { CenterContainer, VerticalStackContainer } from "@/components/ui/molecules/Container"
import { BaseInputText } from "@/components/ui/atoms/Input"
import { BaseButton } from "@/components/ui/atoms/Button";

type Props = {
    familyName: string;
    givenName: string;
    error?: string;
    isLoading: boolean;
    onChangeFamilyName: (v: string) => void;
    onChangeGivenName: (v: string) => void;
    onSubmit: () => void;
};

const CreateNewAccount = ({
    familyName,
    givenName,
    error,
    isLoading,
    onChangeFamilyName,
    onChangeGivenName,
    onSubmit,
}: Props) => {
    return (
        <CenterContainer className="h-screen">
            <VerticalStackContainer className="w-96 shadow-2xl p-8 lg:p-12 border-emerald border-t-16">
                <h3>新しいアカウントを作成</h3>

                <VerticalStackContainer className="w-full" space={4}>
                    <div>
                        <label className="font-semibold">苗字</label>
                        <BaseInputText
                            className="w-full"
                            value={familyName}
                            onChange={(e) => onChangeFamilyName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-semibold">名前</label>
                        <BaseInputText
                            className="w-full"
                            value={givenName}
                            onChange={(e) => onChangeGivenName(e.target.value)}
                        />
                    </div>
                </VerticalStackContainer>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                    </div>
                )}

                <BaseButton
                    color="emerald"
                    className="w-1/2 mx-auto"
                    isLoading={isLoading}
                    onClick={onSubmit}
                >
                    アカウント作成
                </BaseButton>
            </VerticalStackContainer>
        </CenterContainer>
    );
}

export default CreateNewAccount;