import React from "react";
import { useContext } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import TransactionContext from "../contexts/transactionContext";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

function EachFriend({ friend, showFriends }) {
    const { updateFriendRequest } = useContext(TransactionContext);

    const navigate = useNavigate();

    const handleUpdateFriendRequest = (id, message) => {
        if (id && message) {
            updateFriendRequest(id, message).then((res) => {
                if (res.status) {
                    navigate("/");
                }
            });
        }
    };

    return (
        <div className="each-friend">
            <div className="each-friend-user-info">
                <div className="profile-img-wrapper">
                    <img
                        src={`${BACKEND_URL}${friend.user.profileImage}`}
                        alt={friend.user.username}
                        className="profile-img"
                    />
                </div>
                <p className="each-friend-username">{friend.user.username}</p>
            </div>
            {showFriends && (
                <div className="accept-decline-wrapper">
                    <FaCheckCircle
                        className="each-friend-icon"
                        onClick={(e) => {
                            e.preventDefault();
                            handleUpdateFriendRequest(friend.id, "accepted");
                        }}
                    />

                    <FaTimesCircle
                        className="each-friend-icon"
                        onClick={(e) => {
                            e.preventDefault();
                            handleUpdateFriendRequest(friend.id, "declined");
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default EachFriend;
