/**
 * Protected Route Wrapper.
 * Validates JWT session from AuthContext and localStorage.
 * Supports RBAC with allowedRoles array or requiredRole string.
 */
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    const rolesList = allowedRoles || (requiredRole ? [requiredRole] : null);

    useEffect(() => {
        if (!user && !loading) {
            toast.error('Authentication Required', {
                description: 'Please sign in with your credentials to access this portal.',
            });
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] dark:bg-slate-950">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00478d]"></div>
            </div>
        );
    }

    if (!user) {
        // Save the attempted location for redirecting after login
        const isStaffPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff');
        return <Navigate to={isStaffPath ? '/staff/login' : '/login'} state={{ from: location }} replace />;
    }

    if (rolesList && !rolesList.includes(user.role)) {
        toast.error('Access Denied', {
            description: `Your role (${user.role}) is not authorized to access this section.`,
        });
        return <Navigate to={user.role === 'Patient' ? '/dashboard' : '/admin'} replace />;
    }

    return children;
};

export default ProtectedRoute;
