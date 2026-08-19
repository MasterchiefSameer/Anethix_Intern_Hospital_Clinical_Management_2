/**
 * Authentication Context Provider.
 * Manages global user state with localStorage persistence for sessions,
 * login, registration, and logout handling.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('medtrust_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('medtrust_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('medtrust_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
