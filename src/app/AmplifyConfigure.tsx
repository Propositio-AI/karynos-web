//amplifyの設定を参照してクライアントサイドの初期化
//こいつをルートレイアウトで適用してます。
"use client";

import { Amplify } from "aws-amplify";
import amplifyConfig from "@/amplify-config";

Amplify.configure(amplifyConfig);

export default function AmplifyConfigure() {
  return null;
}
