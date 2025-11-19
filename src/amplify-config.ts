// Amplifyの設定定義
interface AmplifyConfig {
  Auth: {
    Cognito: {
      userPoolId: string;
      userPoolClientId: string;
      region: string;
      //ここの項目一旦よくわからなかったのでわかるやつだけ書いてます。実際の実装には変更お願いします。
    };
  };
  //APIのあつかいとかもできるらしいです
}

const amplifyConfig: AmplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
      region: process.env.NEXT_PUBLIC_COGNITO_REGION || "ap-northeast-1",
    },
  },
};

export default amplifyConfig;
