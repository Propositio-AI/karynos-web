import { useState } from 'react';
import { api } from '@/lib/api/client';
import type { AccountType } from '@/types/common';

export const useCreateAccount = () => {
    const [accountType] = useState<AccountType>('dreamer');
    const [familyName, setFamilyName] = useState('');
    const [givenName, setGivenName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const createAccount = async () => {
        try {
            setIsLoading(true);
            setError('');

            if (accountType === 'dreamer') {
                await api.createDreamerApiV1DreamerAdminNewPost({
                    organization_id: 0,
                    name_family: familyName,
                    name_given: givenName,
                });
                setFamilyName('');
                setGivenName('');
            }
        } catch {
            setError('アカウント作成中にエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    return { familyName, givenName, isLoading, error, setFamilyName, setGivenName, createAccount };
};
