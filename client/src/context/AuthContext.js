import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout, register, refreshAccessToken } from '../services/authService';
import { setAccessToken, clearAccessToken, registerExpiredSessionHandler } from "../services/api";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        registerExpiredSessionHandler(() => {
            setUser(null);
            clearAccessToken();
            navigate('/login');
        });
    }, []);
    
    useEffect (() => {
        const tryRestoreSession = async () => {
            try {
                const {user, accessToken} = await refreshAccessToken();
                setAccessToken(accessToken);
                setUser(user);
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        tryRestoreSession();
    }, []);

    const handleLogin = async (email, password) => {
        const { user, accessToken } = await login({email, password});
        setAccessToken(accessToken);
        setUser(user);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            clearAccessToken();
            setUser(null);
            navigate('/login');
        }
    };

    const handleRegister = async (first_name, last_name, email, password) => {
        const { user, accessToken } = await register(first_name, last_name, email, password);
        setAccessToken(accessToken);
        setUser(user);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login: handleLogin,
            logout: handleLogout,
            register: handleRegister,
        }}>
            { children }
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used in an AuthProvider');
    return context;
};

export {
    AuthProvider,
    useAuth,
}