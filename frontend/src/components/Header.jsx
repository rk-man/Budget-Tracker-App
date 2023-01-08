import { useContext } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config";
import AuthContext from "../contexts/authContext";

function Header() {
    const { authUser, logout } = useContext(AuthContext);

    return (
        <header className="header">
            <Link className="link" to="/">
                <h3>Budget Tracker App</h3>
            </Link>
            <nav className="nav-menus">
                {authUser.user && (
                    <>
                        <Link to="/users" className="link nav-menu-link">
                            <p>Users</p>
                        </Link>

                        <Link to="/friends" className="link nav-menu-link">
                            <p>Friends</p>
                        </Link>
                        <button
                            className="btn btn-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                logout();
                            }}
                        >
                            Logout
                        </button>
                        <Link className="link" to="/account">
                            <div className="header-profile-img-wrapper">
                                <img
                                    src={`${BACKEND_URL}${authUser.user.profileImage}`}
                                    alt={authUser.user.username}
                                    className="profile-img"
                                />
                            </div>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
