/**
 * Authentication Context Provider.
 * This file manages global user state. It provides functionality to login, logout,
 * and check the current user's profile across the entire application using React Context.
 */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // TODO: Implement actual API calls to fetch user profile, login, and logout.

    useEffect(() => {
        // Mock authentication check for now
        const checkAuth = async () => {
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
