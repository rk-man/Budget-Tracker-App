import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TransactionContext from "../contexts/transactionContext";
import "./../styles/transaction.css";
import "./../styles/auth.css";
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from "../config";
import { toast } from "react-toastify";
import EachParticipant from "../components/EachParticipant";
import AuthContext from "../contexts/authContext";

function SingleTransactionPage() {
    const { id } = useParams();
    const {
        getSingleTransaction,
        authTransaction,
        updateTransaction,
        reset,
        getAllFriends,
        deleteTransaction,
    } = useContext(TransactionContext);
    const { authUser } = useContext(AuthContext);

    const [transaction, setTransaction] = useState({
        shortDescription: "",
        category: "",
        totalAmount: 0,
        transactionType: "",
        paidBy: null,
    });

    const [participants, setParticipants] = useState([]);
    const [friends, setFriends] = useState([]);

    const [originalTransaction, setOriginalTransaction] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getAllFriends().then((res) => {
            setFriends(res);
        });
    }, []);

    useEffect(() => {
        if (id || (authTransaction.transaction && authTransaction.success)) {
            getSingleTransaction(id).then((res) => {
                setTransaction({
                    shortDescription: res.shortDescription,
                    category: res.category,
                    owner: res.owner,
                    totalAmount: Number(res.totalAmount),
                    transactionType: res.transactionType,
                    paidBy: {
                        id: res.paidBy.id,
                        username: res.paidBy.username,
                    },
                });
                setParticipants(res.participants);
                setOriginalTransaction({
                    shortDescription: res.shortDescription,
                    category: res.category,
                    owner: res.owner,
                    totalAmount: res.totalAmount,
                    transactionType: res.transactionType,
                    paidBy: {
                        id: res.paidBy.id,
                        username: res.paidBy.username,
                    },
                    id: res.id,
                });
            });
        }
    }, [
        id,
        authTransaction.transaction,
        authTransaction.success,
        getSingleTransaction,
    ]);

    useEffect(() => {
        if (authTransaction.transaction && authTransaction.success) {
            toast.success("Transaction Updated Successfully");
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

    const handleResetChanges = (e) => {
        e.preventDefault();
        setTransaction(originalTransaction);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let transactionData = {
            ...transaction,
            paidBy: transaction.paidBy.id,
        };
        updateTransaction(transactionData, id);
    };

    const handleDeleteTransaction = (e) => {
        e.preventDefault();
        deleteTransaction(originalTransaction.id).then((res) => {
            if (res.isDeleted) {
                toast.success("deleted Successfully");
                navigate("/");
            } else {
                toast.error("Couldn't delete...try again later");
            }
        });
    };

    return (
        <div className="single-transaction">
            {transaction.paidBy ? (
                <>
                    <div className="form-wrapper">
                        <form className="form" onSubmit={handleSubmit}>
                            <h3 style={{ marginBottom: "1rem" }}>
                                Transaction Details
                            </h3>
                            <div className="form-field">
                                <label
                                    htmlFor="shortDescription"
                                    className="form-label"
                                >
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
                                <label
                                    htmlFor="category"
                                    className="form-label"
                                >
                                    Category
                                </label>
                                <select
                                    value={transaction.category}
                                    className="form-select"
                                    onChange={handleChangeTransaction}
                                    name="category"
                                >
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
                                <label
                                    htmlFor="totalAmount"
                                    className="form-label"
                                >
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
                                <label
                                    htmlFor="category"
                                    className="form-label"
                                >
                                    Transaction Type
                                </label>
                                <select
                                    value={transaction.transactionType}
                                    className="form-select"
                                    onChange={handleChangeTransaction}
                                    name="transactionType"
                                >
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
                                <label htmlFor="paidBy" className="form-label">
                                    Paid By
                                </label>
                                <select
                                    className="form-select"
                                    value={transaction.paidBy.username}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setTransaction((prev) => {
                                            return {
                                                ...prev,
                                                paidBy: {
                                                    id: e.target
                                                        .selectedOptions[0].id,
                                                    username: e.target.value,
                                                },
                                            };
                                        });
                                    }}
                                >
                                    <option name="select" value="select">
                                        Who paid for this ?
                                    </option>
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

                                    {friends.map((f) => {
                                        return (
                                            <option
                                                name={
                                                    f.sender.id ===
                                                    authUser.user.id
                                                        ? f.friend.username
                                                        : f.sender.username
                                                }
                                                id={
                                                    f.sender.id ===
                                                    authUser.user.id
                                                        ? f.friend.id
                                                        : f.sender.id
                                                }
                                                key={f.id}
                                                className="form-option"
                                            >
                                                {f.sender.id ===
                                                authUser.user.id
                                                    ? f.friend.username
                                                    : f.sender.username}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div
                                className="btns-container"
                                style={{ marginTop: "2rem" }}
                            >
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
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

                    <div className="form-wrapper">
                        <form className="form">
                            <h3>Participant Details</h3>
                            <p>
                                If you wanna update the participants amount, set
                                the transaction type to custom split and save
                                changes
                            </p>
                            <div className="all-participants">
                                {participants.length > 0 ? (
                                    participants.map((p) => {
                                        return (
                                            <EachParticipant
                                                key={p.id}
                                                participant={p}
                                                participants={participants}
                                                transaction={transaction}
                                            />
                                        );
                                    })
                                ) : (
                                    <p>No participants Found</p>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="delete-transaction-btn-wrapper">
                        <button
                            className="btn btn-tertiary"
                            onClick={handleDeleteTransaction}
                        >
                            Delete Transaction
                        </button>
                    </div>
                </>
            ) : (
                <h3>Couldn't find transaction</h3>
            )}
        </div>
    );
}

export default SingleTransactionPage;
