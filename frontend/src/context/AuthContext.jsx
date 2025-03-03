import { createContext, useContext, useEffect, useState } from "react";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();


// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsAuthenticated(true);
        }
    }, [])

    const login = (token) => {
        localStorage.setItem("accessToken", token);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);