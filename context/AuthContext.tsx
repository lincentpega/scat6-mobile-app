// src/context/AuthContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import {
    isLoggedIn as checkAuth,
    signInAsync,
    logoutAsync,
} from '@/services/authService';

interface AuthContextValue {
    isUserLoggedIn: boolean;
    signIn: () => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    // при старте приложения проверяем, залогинен ли пользователь
    useEffect(() => {
        (async () => {
            const loggedIn = await checkAuth();
            setIsUserLoggedIn(loggedIn);
        })();
    }, []);

    // функция логина
    const signIn = async (): Promise<boolean> => {
        const success = await signInAsync();
        if (success) {
            setIsUserLoggedIn(true);
        }
        return success;
    };

    // функция логаута
    const logout = async (): Promise<void> => {
        await logoutAsync();
        setIsUserLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isUserLoggedIn, signIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
};
