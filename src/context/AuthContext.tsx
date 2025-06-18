"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { getDecodedToken, logoutHelper } from "@/utils/helper";

interface User {
    id?: string;
    username?: string;
    display_name?: string;
    role?: string;
    site?: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const decodedUser = getDecodedToken();
        if (decodedUser) {
            setUser(decodedUser);
        }
    }, []);

    const logout = () => {
        logoutHelper();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng context dễ dàng
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};