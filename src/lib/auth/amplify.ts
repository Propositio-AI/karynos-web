"use client";

import { Amplify } from "aws-amplify";

let configured = false;

export const isCognitoConfigured = () => {
    return Boolean(
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID &&
            process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    );
};

export const configureAmplify = () => {
    if (configured || !isCognitoConfigured()) {
        return configured;
    }

    Amplify.configure({
        Auth: {
            Cognito: {
                userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string,
                userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
            },
        },
    });

    configured = true;
    return configured;
};

configureAmplify();
