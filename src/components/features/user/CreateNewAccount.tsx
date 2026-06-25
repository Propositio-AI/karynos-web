"use client";

import { BaseButton } from "@/components/ui/atoms/Button";
import { BaseInputText } from "@/components/ui/atoms/Input";
import { CenterContainer, VerticalStackContainer } from "@/components/ui/molecules/Container";

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
		<CenterContainer className="min-h-screen overflow-hidden bg-canvas px-5 py-10">
			<div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(135deg,#ecfdf5_0%,#fafaf9_56%,#fffbeb_100%)]" />
			<VerticalStackContainer
				className="relative z-10 w-full max-w-md rounded-lg border border-line bg-surface/95 p-8 shadow-lift backdrop-blur"
				space={8}
			>
				<div>
					<p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
						Profile
					</p>
					<h1>プロフィールを作成</h1>
					<p className="mt-3 text-sm leading-6 text-muted">
						表示名に使うお名前を入力してください。
					</p>
				</div>

				<VerticalStackContainer className="w-full" space={4}>
					<BaseInputText
						className="w-full"
						label="姓"
						value={familyName}
						placeholder="山田"
						onChange={(e) => onChangeFamilyName(e.target.value)}
					/>

					<BaseInputText
						className="w-full"
						label="名"
						value={givenName}
						placeholder="太郎"
						onChange={(e) => onChangeGivenName(e.target.value)}
					/>
				</VerticalStackContainer>

				{error && (
					<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
						{error}
					</div>
				)}

				<BaseButton
					color="emerald"
					className="w-full"
					isLoading={isLoading}
					onClick={onSubmit}
				>
					アカウントを作成
				</BaseButton>
			</VerticalStackContainer>
		</CenterContainer>
	);
};

export default CreateNewAccount;
