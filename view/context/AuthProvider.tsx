import { createContext, useState, ReactNode } from "react";
import { GenerateUUID } from "react-native-uuid";

interface AuthData {
    email: string;
    pwd?: string;
    accessToken: string;
    userId: string;
    user: string;
    isPaid: boolean
}

interface AuthContextType {
    auth: AuthData
    setAuth: (auth: AuthData) => void;
    loggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    trigger: number
    setTrigger: (value: number) => void
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<AuthContextType['auth']>({} as AuthData);
    const [loggedIn, setIsLoggedIn] = useState(false);
    const [trigger, setTrigger] = useState<number>(0);

    return (
        <AuthContext.Provider value={{ auth, setAuth, loggedIn, setIsLoggedIn, trigger, setTrigger }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext