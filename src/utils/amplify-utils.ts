//なんかamplify v6から必要になったらしい...？
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import amplifyConfig from "@/amplify-config";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});
