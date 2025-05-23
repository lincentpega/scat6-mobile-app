import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useMemo
} from 'react';
import {
    isLoggedIn as checkAuth,
    signInAsync,
    logoutAsync,
    getUserFullName,
} from '@/services/authService';

interface AuthContextValue {
    isUserLoggedIn: boolean;
    userFullName: string | null;
    signIn: () => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [userFullName, setUserFullName] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const loggedIn = await checkAuth();
            setIsUserLoggedIn(loggedIn);
            if (loggedIn) {
                const name = await getUserFullName();
                setUserFullName(name);
            }
        })();
    }, []);

    const signIn = async (): Promise<boolean> => {
        const success = await signInAsync();
        if (success) {
            setIsUserLoggedIn(true);
            const name = await getUserFullName();
            setUserFullName(name);
        }
        return success;
    };

    const logout = async (): Promise<void> => {
        await logoutAsync();
        setIsUserLoggedIn(false);
        setUserFullName(null);
    };

    const value = useMemo(
        () => ({ isUserLoggedIn, userFullName, signIn, logout }),
        [isUserLoggedIn, userFullName, signIn, logout]
    );

    return (
        <AuthContext.Provider value={value}>
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
