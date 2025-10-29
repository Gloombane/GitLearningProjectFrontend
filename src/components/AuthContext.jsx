import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true; // чтобы куки отправлялись автоматически

const AuthContext = createContext();

export const AuthProvider = ({ children, clearBasket }) => {
    const [currentUser, setCurrentUser] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    const login = async (formData) => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/login',
                new URLSearchParams(formData),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            if (response.status === 204 || response.status === 200) {
                await checkAuth(); // обновляем currentUser и userRole
            }
        } catch (err) {
            console.error("Ошибка при логине:", err);
            throw err;
        }
    };

    const logOut = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/logout');
            setCurrentUser(false);
            setUserEmail('');
            setUserRole('');
            if (clearBasket) {
                clearBasket(); 
            }
            navigate('/');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const checkAuth = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/auth/check');
            if (response.status === 200) {
                setCurrentUser(true);
                setUserEmail(response.data.email);
                setUserRole(response.data.role);
            } else {
                setCurrentUser(false);
                setUserEmail('');
                setUserRole('');
            }
        } catch {
            setCurrentUser(false);
            setUserEmail('');
            setUserRole('');
        }
    };

    // Проверяем авторизацию при монтировании
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            currentUser,
            userEmail,
            userRole,
            login,
            logOut,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
