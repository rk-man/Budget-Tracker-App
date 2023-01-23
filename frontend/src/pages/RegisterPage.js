import React, { useContext, useState, useEffect } from "react";
import "./../styles/auth.css";
import AuthContext from "./../contexts/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function RegisterPage() {
    const { register, authUser, reset } = useContext(AuthContext);

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (authUser.user && authUser.success) {
            toast.success("Successfully registered");
            navigate("/");
            reset();
        } else if (authUser.error && authUser.message) {
            toast.error(authUser.message);
            setUserData({ username: "", password: "", email: "" });
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
        register(userData);
    };
    return (
        <div className="form-wrapper">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Register here</h2>
                <div className="form-field">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="eg: robert"
                        onChange={(e) => {
                            e.preventDefault();
                            setUserData((prev) => {
                                return {
                                    ...prev,
                                    email: e.target.value,
                                };
                            });
                        }}
                        value={userData.email}
                    />
                </div>
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
                        Register
                    </button>
                    <button className="btn btn-secondary">Cancel</button>
                </div>
                <Link to="/auth/login" className="link">
                    <p>
                        Already a user ?{" "}
                        <span
                            style={{
                                fontWeight: "500",
                                textDecoration: "underline",
                            }}
                        >
                            Login here
                        </span>{" "}
                    </p>
                </Link>
            </form>
        </div>
    );
}

export default RegisterPage;
