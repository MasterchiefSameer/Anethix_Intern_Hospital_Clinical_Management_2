import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            toast.error('Authentication Required', {
                description: 'Please sign in or register to book an appointment or view your health records.',
            });
        }
    }, [user]);

    if (!user) {
        // Save the attempted location for redirecting after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        toast.error('Access Denied', {
            description: 'You do not have permission to view this page.',
        });
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
