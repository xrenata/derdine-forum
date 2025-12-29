'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, login as apiLogin, register as apiRegister, getUser } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (username: string, email: string, pass: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkUser = async () => {
        const storedUserConf = localStorage.getItem('user');
        if (storedUserConf) {
            try {
                const parsedUser = JSON.parse(storedUserConf);
                try {
                    const userFromDb = await getUser(parsedUser._id);
                    if (userFromDb) {
                        setUser(userFromDb);
                        localStorage.setItem('user', JSON.stringify(userFromDb));
                    } else {
                        throw new Error('User not found');
                    }
                } catch (err) {
                    console.warn('Session verification failed, logging out:', err);
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch (e) {
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (email: string, pass: string) => {
        setIsLoading(true);
        try {
            const userData = await apiLogin(email, pass);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string, email: string, pass: string) => {
        setIsLoading(true);
        try {
            const userData = await apiRegister(username, email, pass);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/');
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
