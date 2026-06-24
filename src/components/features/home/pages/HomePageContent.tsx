"use client";

import { CircularProgress } from "@/components/ui/molecules/CircularProgress";

export default function HomePageContent() {
	return (
		<div>
			<h1>Home</h1>
			<p className="mt-10">使用例 ※詳細はコンポーネントのソースコードを参照してください</p>
			<div className="flex gap-8 justify-center p-6">
				<CircularProgress
					label="平均年収(アニメーションなし)"
					value={620}
					max={1000}
					unit="万"
					color="#b07f2f"
					size={120}
					strokeWidth={12}
					animation={false}
				/>
				<CircularProgress
					label="休日数"
					value={120}
					max={200}
					unit="日"
					color="#146b48"
					size={170}
					strokeWidth={25}
				/>
				<CircularProgress label="平均年齢" value={28} max={60} unit="歳" color="#0c0f14" />
			</div>
		</div>
	);
}
