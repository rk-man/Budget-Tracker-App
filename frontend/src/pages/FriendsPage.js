import React, { useContext, useEffect, useState } from "react";
import EachFriend from "../components/EachFriend";
import AuthContext from "../contexts/authContext";
import TransactionContext from "../contexts/transactionContext";
import "./../styles/friends.css";

function FriendsPage() {
    const { getAllAcceptedNonAccepetedFriends } =
        useContext(TransactionContext);
    const { authUser } = useContext(AuthContext);

    const [friends, setFriends] = useState([]);
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [tobeAccepetedFriends, setToBeAcceptedFriends] = useState([]);
    const [showFriends, setShowFriends] = useState("accepted");

    useEffect(() => {
        if (authUser.user) {
            getAllAcceptedNonAccepetedFriends().then((res) => {
                setFriends(
                    res.map((f) => {
                        f.user =
                            f.sender.id === authUser.user.id
                                ? f.friend
                                : f.sender;
                        return f;
                    })
                );
            });
        }
    }, [getAllAcceptedNonAccepetedFriends, authUser.user]);

    useEffect(() => {
        if (friends.length > 0) {
            setAcceptedFriends(friends.filter((f) => f.status === true));

            setPendingFriends(
                friends.filter(
                    (f) => f.sender.id == authUser.user.id && f.status == false
                )
            );

            setToBeAcceptedFriends(
                friends.filter(
                    (f) => f.friend.id == authUser.user.id && f.status == false
                )
            );
        }
    }, [friends]);

    return (
        <div>
            <div className="btns-container">
                <button
                    className="btn btn-tertiary"
                    onClick={(e) => {
                        setShowFriends("accepted");
                    }}
                >
                    friends
                </button>
                <button
                    className="btn btn-tertiary"
                    onClick={(e) => {
                        setShowFriends("pending");
                    }}
                >
                    Pending Requests You Sent
                </button>
                <button
                    className="btn btn-tertiary"
                    onClick={(e) => {
                        setShowFriends("to be accepted");
                    }}
                >
                    Pending Requests To You
                </button>
            </div>
            <div className="friends-list">
                {showFriends === "accepted" &&
                    (acceptedFriends.length > 0 ? (
                        acceptedFriends.map((f) => {
                            return <EachFriend key={f.id} friend={f} />;
                        })
                    ) : (
                        <p style={{ fontSize: "2rem", fontWeight: "600" }}>
                            No Friends
                        </p>
                    ))}
            </div>

            <div className="friends-list">
                {showFriends === "pending" &&
                    (pendingFriends.length > 0 ? (
                        pendingFriends.map((f) => {
                            return <EachFriend key={f.id} friend={f} />;
                        })
                    ) : (
                        <p style={{ fontSize: "2rem", fontWeight: "600" }}>
                            No Pending Requests You Sent
                        </p>
                    ))}
            </div>

            <div className="friends-list">
                {showFriends === "to be accepted" &&
                    (tobeAccepetedFriends.length > 0 ? (
                        tobeAccepetedFriends.map((f) => {
                            return (
                                <EachFriend
                                    key={f.id}
                                    friend={f}
                                    showFriends={showFriends}
                                />
                            );
                        })
                    ) : (
                        <p style={{ fontSize: "2rem", fontWeight: "600" }}>
                            No Pending Requests You Recieved
                        </p>
                    ))}
            </div>
        </div>
    );
}

export default FriendsPage;
