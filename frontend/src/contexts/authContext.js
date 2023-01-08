import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { SetCookie } from "../helpers";
import { GetCookie, RemoveCookie } from "../helpers";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState({
        user: null,
        success: false,
        error: false,
        message: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const getCurrentlyLoggedInUser = async () => {
            try {
                let token = GetCookie("token");
                const res = await axios.get(`${BACKEND_URL}/api/v1/auth/me/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAuthUser({
                    user: res.data,
                    success: false,
                    error: false,
                    message: "",
                });
            } catch (err) {
                setAuthUser({
                    user: null,
                    success: false,
                    error: false,
                    message: "",
                });
                navigate("/auth/login");
            }
        };
        getCurrentlyLoggedInUser();
    }, [navigate]);

    const getMe = async () => {
        let user = null;
        try {
            let token = GetCookie("token");
            const res = await axios.get(`${BACKEND_URL}/api/v1/auth/me/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            user = res.data;
        } catch (err) {
            console.log(err);
        }
        return user;
    };

    const login = async (userData) => {
        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/auth/login/`,
                userData
            );
            SetCookie("token", res.data.token);

            setAuthUser({
                user: res.data.profile,
                success: true,
                error: false,
                message: "",
            });
        } catch (err) {
            setAuthUser({
                user: null,
                success: false,
                error: true,
                message: err.response.data.detail,
            });
        }
    };
    const register = async (userData) => {
        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/auth/register/`,
                userData
            );
            SetCookie("token", res.data.token);

            setAuthUser({
                user: res.data.profile,
                success: true,
                error: false,
                message: "",
            });
        } catch (err) {
            setAuthUser({
                user: null,
                success: false,
                error: true,
                message: err.response.data.detail,
            });
        }
    };

    const logout = async () => {
        try {
            RemoveCookie("token");
            navigate("/auth/login");
        } catch (err) {
            console.log(err);
        }
    };

    const updateUser = async (userData, id) => {
        let user = null;
        try {
            let token = GetCookie("token");
            const res = await axios.patch(
                `${BACKEND_URL}/api/v1/users/${id}/update/`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            user = res.data;
        } catch (err) {
            console.log(err);
        }
        return {
            user,
        };
    };

    const reset = () => {
        setAuthUser((prev) => {
            return {
                ...prev,
                success: false,
                error: false,
                message: "",
            };
        });
    };

    return (
        <AuthContext.Provider
            value={{
                authUser,
                login,
                reset,
                register,
                logout,
                updateUser,
                getMe,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
