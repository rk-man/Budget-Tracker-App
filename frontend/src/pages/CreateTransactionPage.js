import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TransactionContext from "../contexts/transactionContext";
import "./../styles/transaction.css";
import "./../styles/auth.css";
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from "../config";
import { toast } from "react-toastify";
import AuthContext from "./../contexts/authContext";

function CreateTransactionPage() {
    const { authTransaction, reset, createTransaction, getAllFriends } =
        useContext(TransactionContext);
    const { authUser } = useContext(AuthContext);

    const [transaction, setTransaction] = useState({
        shortDescription: "",
        category: "",
        totalAmount: 0,
        transactionType: "",
        paidBy: {
            id: "",
            username: "",
        },
    });

    const [friends, setFriends] = useState([]);
    const [participants, setParticipants] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getAllFriends().then((res) => {
            setFriends(res);
        });
    }, []);

    useEffect(() => {
        if (authTransaction.transaction && authTransaction.success) {
            toast.success("Transaction Updated Successfully");
            navigate("/");
            reset();
        } else if (authTransaction.error && authTransaction.message) {
            toast.error(authTransaction.message);
            reset();
        }
    }, [
        authTransaction.transaction,
        authTransaction.success,
        authTransaction.error,
        authTransaction.message,
        reset,
        navigate,
    ]);

    const handleChangeTransaction = (e) => {
        e.preventDefault();
        setTransaction((prev) => {
            return {
                ...prev,
                [`${e.target.name}`]: e.target.value,
            };
        });
    };

    const handleChangeParticipants = (e) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            setParticipants((prev) => {
                return [...prev, e.target.id];
            });
        } else {
            console.log(participants);
            setParticipants(
                participants.filter((p) => {
                    return p !== e.target.id;
                })
            );
        }
    };

    const handleTransactionSubmit = (e) => {
        e.preventDefault();

        if (
            transaction.paidBy.id == "" ||
            transaction.category.startsWith("select a") ||
            transaction.transactionType.startsWith("select a")
        ) {
            return;
        }

        let transactionData = {
            ...transaction,
            paidBy: transaction.paidBy.id,
            participants,
        };
        createTransaction(transactionData);
    };

    const handleResetChanges = (e) => {
        e.preventDefault();
    };
    return (
        <div className="form-wrapper">
            <form className="form" onSubmit={handleTransactionSubmit}>
                <h3 style={{ marginBottom: "1rem" }}>Transaction Details</h3>
                <div className="form-field">
                    <label htmlFor="shortDescription" className="form-label">
                        Short Description
                    </label>
                    <input
                        type="text"
                        name="shortDescription"
                        id="shortDescription"
                        className="form-input"
                        value={transaction.shortDescription}
                        onChange={handleChangeTransaction}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="category" className="form-label">
                        Category
                    </label>
                    <select
                        value={transaction.category}
                        className="form-select"
                        onChange={handleChangeTransaction}
                        name="category"
                    >
                        <option name="select a category">
                            select a category
                        </option>
                        {TRANSACTION_CATEGORIES.map((c, index) => {
                            return (
                                <option
                                    name={c}
                                    key={index}
                                    className="form-option"
                                >
                                    {c}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor="totalAmount" className="form-label">
                        Total Amount
                    </label>
                    <input
                        type="number"
                        name="totalAmount"
                        id="totalAmount"
                        className="form-input"
                        value={transaction.totalAmount}
                        onChange={handleChangeTransaction}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="paidBy" className="form-label">
                        Paid By
                    </label>
                    <select
                        className="form-select"
                        onChange={(e) => {
                            e.preventDefault();
                            setTransaction((prev) => {
                                return {
                                    ...prev,
                                    paidBy: {
                                        id: e.target.selectedOptions[0].id,
                                        username: e.target.value,
                                    },
                                };
                            });
                        }}
                        value={transaction.paidBy.username}
                    >
                        <option name="select">Who paid for this ?</option>
                        {authUser.user && (
                            <option
                                name={authUser.user.username}
                                id={authUser.user.id}
                                className="form-option"
                                value={authUser.user.username}
                            >
                                {authUser.user.username}
                            </option>
                        )}

                        {friends.length > 0 &&
                            friends.map((f) => {
                                return (
                                    <option
                                        id={
                                            f.sender &&
                                            f.sender.id === authUser.user.id
                                                ? f.friend && f.friend.id
                                                : f.sender.id
                                        }
                                        key={f.id}
                                        className="form-option"
                                    >
                                        {f.sender.id === authUser.user.id
                                            ? f.friend.username
                                            : f.sender.username}
                                    </option>
                                );
                            })}
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="category" className="form-label">
                        Transaction Type
                    </label>
                    <select
                        value={transaction.transactionType}
                        className="form-select"
                        onChange={handleChangeTransaction}
                        name="transactionType"
                    >
                        <option name="select a transaction type">
                            select a transaction type
                        </option>
                        {TRANSACTION_TYPES.map((c, index) => {
                            return (
                                <option
                                    name={c}
                                    key={index}
                                    className="form-option"
                                >
                                    {c}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="participants" className="form-label">
                        Participants
                    </label>
                    {authUser.user && (
                        <div className="participants-friends-data">
                            <input
                                type="checkbox"
                                onChange={handleChangeParticipants}
                                id={authUser.user.id}
                            />
                            <p>{authUser.user.username}</p>
                        </div>
                    )}

                    {friends.map((f) => {
                        return (
                            <div
                                key={f.id}
                                className="participants-friends-data"
                            >
                                <input
                                    type="checkbox"
                                    onChange={handleChangeParticipants}
                                    id={
                                        f.sender.id === authUser.user.id
                                            ? f.friend.id
                                            : f.sender.id
                                    }
                                />
                                <p>
                                    {f.sender.id === authUser.user.id
                                        ? f.friend.username
                                        : f.sender.username}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="btns-container" style={{ marginTop: "2rem" }}>
                    <button className="btn btn-primary" type="submit">
                        Save Changes
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleResetChanges}
                    >
                        Reset Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateTransactionPage;
