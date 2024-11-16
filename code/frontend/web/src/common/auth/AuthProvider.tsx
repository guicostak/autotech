"use client";

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store/store';
import { authenticate } from '@/services/authService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import useLogin from '@/hooks/useLogin';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();  
    const router = useRouter();
    const token = useSelector((state: RootState) => state.user.token) || '';
    const userId = useSelector((state: RootState) => state.user.userInfo?.id) || '';
    const refreshToken = useSelector((state: RootState) => state.user.refreshToken) || '';
    const email = useSelector((state: RootState) => state.user.userInfo?.email) || '';
    const expires = useSelector((state: RootState) => state.user.expires) || 0;

    const isTokenExpired = (): boolean => {
        if (!expires) return true;
        const now = new Date().getTime();
        return now > expires;
    };
    const { handleLogout } = useLogin();

    useEffect(() => {
        const authenticateUser = async () => {
            if (token && userId) {
                if (isTokenExpired()) {
                    console.log('Token expirado. Renovando token...');

                    try {
                        const response = await authenticate({ email, refreshToken }, dispatch);

                        if (response && (response.status === 200 || response.status === 201)) {
                            console.log('Token renovado com sucesso.');
                        } else {
                            throw new Error('Erro ao renovar o token.');
                        }
                    } catch (error: any) {
                        console.error('Erro ao tentar autenticar:', error);
                        handleLogout();
                    }
                }
            }
        };

        authenticateUser();
    }, [token, userId, dispatch, router]);

    return <>{children}</>;
};

export default AuthProvider;
