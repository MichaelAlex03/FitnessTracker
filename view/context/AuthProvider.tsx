import { createContext, useState, ReactNode } from "react";

interface AuthData {
    user: string;
    pwd?: string;
    accessToken: string;
    userId?: string;
}

interface AuthContextType {
    auth: AuthData
    setAuth: (auth: AuthData) => void;
    loggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<AuthContextType['auth']>({} as AuthData);
    const [loggedIn, setIsLoggedIn] = useState(false)

    return (
        <AuthContext.Provider value={{ auth, setAuth, loggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext