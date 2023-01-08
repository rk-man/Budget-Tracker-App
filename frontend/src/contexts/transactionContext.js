import axios from "axios";
import { createContext, useState } from "react";
import { BACKEND_URL } from "../config";
import { GetCookie } from "../helpers";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
    const [authTransaction, setAuthTransaction] = useState({
        transaction: null,
        success: false,
        error: false,
        message: "",
    });

    const getAllFriends = async () => {
        let friends = [];
        try {
            let token = GetCookie("token");

            const res = await axios.get(
                `${BACKEND_URL}/api/v1/users/friends/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            friends = res.data;
        } catch (err) {
            console.log(err);
        }

        return friends;
    };
    const getAllAcceptedNonAccepetedFriends = async () => {
        let friends = [];
        try {
            let token = GetCookie("token");

            const res = await axios.get(
                `${BACKEND_URL}/api/v1/users/friends/all-friends`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            friends = res.data;
        } catch (err) {
            console.log(err);
        }

        return friends;
    };

    const updateFriendRequest = async (id, message) => {
        let status = false;
        try {
            let token = GetCookie("token");

            await axios.patch(
                `${BACKEND_URL}/api/v1/users/friends/requests/${id}/update/`,
                {
                    message,
                },
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

    const createTransaction = async (transactionData) => {
        try {
            let token = GetCookie("token");

            const res = await axios.post(
                `${BACKEND_URL}/api/v1/transactions/create/`,
                transactionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAuthTransaction({
                transaction: res.data,
                success: true,
                error: false,
                message: "",
            });
        } catch (err) {
            setAuthTransaction({
                transaction: null,
                success: false,
                error: true,
                message: err.response.data.detail
                    ? err.response.data.detail
                    : "Something went wrong when updating transaction",
            });
        }
    };

    const deleteTransaction = async (id) => {
        let isDeleted = false;
        try {
            let token = GetCookie("token");

            await axios.delete(
                `${BACKEND_URL}/api/v1/transactions/${id}/delete/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            isDeleted = true;
        } catch (err) {
            console.log(err);
        }

        return {
            isDeleted,
        };
    };

    const getAllTransactions = async (query) => {
        let transactions = [];
        try {
            let token = GetCookie("token");

            const res = await axios.get(
                `${BACKEND_URL}/api/v1/transactions/all-transactions/${query}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            transactions = res.data;
        } catch (err) {
            console.log(err);
        }
        return transactions;
    };

    const getSingleTransaction = async (id) => {
        let transaction = null;
        try {
            let token = GetCookie("token");

            const res = await axios.get(
                `${BACKEND_URL}/api/v1/transactions/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            transaction = res.data;
        } catch (err) {
            console.log(err);
        }
        return transaction;
    };

    const updateTransaction = async (transactionData, transactionID) => {
        try {
            let token = GetCookie("token");

            const res = await axios.patch(
                `${BACKEND_URL}/api/v1/transactions/${transactionID}/update/`,
                transactionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAuthTransaction({
                transaction: res.data,
                success: true,
                error: false,
                message: "",
            });
        } catch (err) {
            setAuthTransaction({
                transaction: null,
                success: false,
                error: true,
                message: err.response.data.detail
                    ? err.response.data.detail
                    : "Something went wrong when updating transaction",
            });
        }
    };

    const updateParticipant = async (participantData, participantID) => {
        try {
            let token = GetCookie("token");

            const res = await axios.patch(
                `${BACKEND_URL}/api/v1/transactions/participants/${participantID}/update/`,
                participantData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const reset = () => {
        setAuthTransaction((prev) => {
            return {
                ...prev,
                success: false,
                error: false,
                message: "",
            };
        });
    };

    return (
        <TransactionContext.Provider
            value={{
                getAllTransactions,
                authTransaction,
                reset,
                getSingleTransaction,
                updateTransaction,
                updateParticipant,
                createTransaction,
                getAllFriends,
                deleteTransaction,
                getAllAcceptedNonAccepetedFriends,
                updateFriendRequest,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}

export default TransactionContext;
