import React, { useContext, useState, useEffect } from "react";
import "./../styles/auth.css";
import AuthContext from "./../contexts/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function LoginPage() {
    const { login, authUser, reset } = useContext(AuthContext);

    const [userData, setUserData] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (authUser.user && authUser.success) {
            toast.success("Successfully logged in");
            navigate("/");
            reset();
        } else if (authUser.error && authUser.message) {
            toast.error(authUser.message);
            setUserData({ username: "", password: "" });
            reset();
        }
    }, [
        authUser.success,
        authUser.message,
        authUser.error,
        authUser.user,
        reset,
        navigate,
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(userData);
    };

    return (
        <div className="form-wrapper">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Login here</h2>
                <div className="form-field">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-input"
                        placeholder="eg: robert"
                        onChange={(e) => {
                            e.preventDefault();
                            setUserData((prev) => {
                                return {
                                    ...prev,
                                    username: e.target.value,
                                };
                            });
                        }}
                        value={userData.username}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        placeholder="********"
                        onChange={(e) => {
                            e.preventDefault();
                            setUserData((prev) => {
                                return {
                                    ...prev,
                                    password: e.target.value,
                                };
                            });
                        }}
                        value={userData.password}
                    />
                </div>

                <div className="btns-container">
                    <button className="btn btn-primary" type="submit">
                        Login
                    </button>
                    <button className="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
