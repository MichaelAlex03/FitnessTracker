import React, { useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import { router } from 'expo-router';

const RequireAuth = ({ children }) => {

    const { auth } = useAuth();

    useEffect(() => {
        if (!auth?.user) {
            // If user is not authenticated, navigate to Login
            router.replace('/Login'); // Adjust the path to your login screen
        }
    }, [auth, router]);

    // If user is not authenticated, return null to prevent rendering the children
    if (!auth?.user) {
        return null; // Optionally, you can return a loading indicator here
    }

    return <>{children}</>; // Render the children if authenticated
}

export default RequireAuth