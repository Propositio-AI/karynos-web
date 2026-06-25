import {
	VerticalStackContainer,
	HorizontalStackContainer,
} from "@/components/ui/molecules/Container";
import { BaseInputText, BaseTextArea } from "@/components/ui/atoms/Input";

export const DreamerForm = () => {
	return (
		<VerticalStackContainer
			space={8}
			className="bg-surface border-line p-8 rounded-(--radius-md)"
		>
			<VerticalStackContainer space={4}>
				<HorizontalStackContainer space={4}>
					<BaseInputText placeholder="山田" label="姓 *" />
					<BaseInputText placeholder="太郎" label="名 *" />
				</HorizontalStackContainer>
				<HorizontalStackContainer space={4}>
					<BaseInputText placeholder="ST001" label="学籍番号 *" />
					<BaseInputText placeholder="2024" type="number" label="入学年度" />
				</HorizontalStackContainer>

				<p>ここにグループ選択インプットを作成する</p>
			</VerticalStackContainer>

			<VerticalStackContainer space={4}>
				<BaseInputText value="123456abc" label="初期パスワード *" />
			</VerticalStackContainer>
		</VerticalStackContainer>
	);
};

export const GroupForm = () => {
	return (
		<VerticalStackContainer
			space={8}
			className="bg-surface border-line p-8 rounded-(--radius-md)"
		>
			<BaseInputText placeholder="3年A組" label="グループ名 *" />

			<BaseTextArea placeholder="グループの説明" label="説明" />
		</VerticalStackContainer>
	);
};
