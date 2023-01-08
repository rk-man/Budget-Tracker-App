import React, { useState } from "react";
import "./../styles/Users.css";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { GetCookie } from "../helpers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();

    const searchUser = async (searchQuery) => {
        let user = null;
        try {
            let token = GetCookie("token");
            const res = await axios.get(
                `${BACKEND_URL}/api/v1/users/search/${searchQuery}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            user = Object.keys(res.data).length === 0 ? null : res.data;
        } catch (err) {
            console.log(err);
        }
        return user;
    };

    const sendFriendRequest = async (id) => {
        let status = false;
        try {
            let token = GetCookie("token");
            await axios.post(
                `${BACKEND_URL}/api/v1/users/friends/${id}/request/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            status = true;
        } catch (err) {
            console.log(err);
        }
        return {
            status,
        };
    };

    const handleSearchResults = (e) => {
        e.preventDefault();
        if (searchQuery.length > 0) {
            searchUser(searchQuery).then((res) => {
                console.log(res);
                setCurrentUser(res);
            });
        }
    };

    const handleFriendRequest = (e) => {
        e.preventDefault();
        if (currentUser)
            sendFriendRequest(currentUser.user.id).then((res) => {
                if (res.status) {
                    toast.success("Your friend request is sent");
                } else {
                    toast.error("Couldn't send a friend request");
                }
                setCurrentUser(null);
                setSearchQuery("");
            });
    };

    return (
        <div>
            <form className="search-bar" onSubmit={handleSearchResults}>
                <h3>Search to make a new friend</h3>
                <input
                    type="text"
                    className="search-input"
                    onChange={(e) => {
                        e.preventDefault();
                        setSearchQuery(e.target.value);
                    }}
                    value={searchQuery}
                />
                <button className="btn btn-tertiary" type="submit">
                    Search
                </button>
            </form>

            <div className="searchd-user-info">
                {currentUser ? (
                    <>
                        <div className="profile-img-wrapper">
                            <img
                                src={`${BACKEND_URL}${currentUser.user.profileImage}`}
                                alt=""
                                className="profile-img"
                            />
                        </div>
                        <p className="searchd-user-info-username">
                            {currentUser.user.username}
                        </p>
                        <p>{currentUser.user.email}</p>
                        {currentUser.user.phoneNo && (
                            <p>{currentUser.user.phoneNo}</p>
                        )}
                        {currentUser.isFriend === "non-friend" && (
                            <button
                                className="btn btn-primary"
                                onClick={handleFriendRequest}
                            >
                                Add Friend
                            </button>
                        )}
                        {currentUser.isFriend === "friend" && (
                            <p>
                                {currentUser.user.username} is already a friend
                            </p>
                        )}

                        {currentUser.isFriend === "pending" && <p>Pending</p>}
                    </>
                ) : (
                    <h3 style={{ width: "100%" }}>No user found so far</h3>
                )}
            </div>
        </div>
    );
}

export default UsersPage;
