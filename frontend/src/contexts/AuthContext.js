import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(localStorage.getItem("username") || null);


    const login = (newToken, email) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("username", email);
        setUser(email)
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout,user }}>
            {children}
        </AuthContext.Provider>
    );
};