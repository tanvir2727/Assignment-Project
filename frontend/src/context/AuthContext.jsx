import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext();


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

export const useAuth = () => useContext(AuthContext);