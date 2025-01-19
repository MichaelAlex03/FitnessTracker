import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loggedIn, setIsLoggedIn] = useState(false)

    return (
        <AuthContext.Provider value={{ auth, setAuth, loggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext