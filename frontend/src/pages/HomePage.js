import React, { useContext, useEffect, useState } from "react";
import EachTransaction from "../components/EachTransaction";
import TransactionContext from "./../contexts/transactionContext";
import "./../styles/transaction.css";
import { Link } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from "../config";

function HomePage() {
    const { getAllTransactions } = useContext(TransactionContext);
    const [transactions, setTransactions] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [transactionTypeFilter, setTransactionTypeFilter] = useState("");

    useEffect(() => {
        getAllTransactions().then((res) => {
            setTransactions(res);
        });
    }, [getAllTransactions]);

    const handleCategoryFilter = (e) => {
        e.preventDefault();
        setCategoryFilter(e.target.value);
        setTransactionTypeFilter("select a transaction type");
    };

    const handleTransactionTypeFilter = (e) => {
        e.preventDefault();
        setTransactionTypeFilter(e.target.value);
        setCategoryFilter("select a category");
    };

    const handleApplyFilter = (e) => {
        e.preventDefault();
        if (categoryFilter !== "" && categoryFilter !== "select a category") {
            getAllTransactions(categoryFilter).then((res) => {
                setTransactions(res);
            });
        } else if (
            transactionTypeFilter !== "" &&
            transactionTypeFilter !== "select a transaction type"
        ) {
            getAllTransactions(transactionTypeFilter).then((res) => {
                setTransactions(res);
            });
        }
    };

    const removeFilters = (e) => {
        e.preventDefault();
        setCategoryFilter("select a category");
        setTransactionTypeFilter("select a transaction type");
        getAllTransactions().then((res) => {
            setTransactions(res);
        });
    };

    return (
        <div>
            <Link
                to="/transactions/create"
                className="link create-transaction-btn"
            >
                <p>Create Transaction</p>
                <FaPlusCircle className="icon" />
            </Link>

            <div className="filter-container">
                <div className="filters-info">
                    <h3>Apply Filters</h3>
                    <p>(Can only apply one filter at a time)</p>
                </div>

                <div className="all-filters">
                    <div className="filter-wrapper">
                        <p style={{ fontWeight: "600" }}>Based on categories</p>
                        <select
                            onChange={handleCategoryFilter}
                            value={categoryFilter}
                            className="filter-option"
                        >
                            <option>select a category</option>
                            {TRANSACTION_CATEGORIES.map((c, index) => {
                                return (
                                    <option
                                        key={index}
                                        className="filter-option-item"
                                    >
                                        {c}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="filter-wrapper">
                        <p style={{ fontWeight: "600" }}>
                            Based on Transaction Type
                        </p>
                        <select
                            onChange={handleTransactionTypeFilter}
                            value={transactionTypeFilter}
                            className="filter-option"
                        >
                            <option className="filter-option-item">
                                select a transaction type
                            </option>
                            {TRANSACTION_TYPES.map((c, index) => {
                                return <option key={index}>{c}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div className="btns-container" style={{ marginTop: "1rem" }}>
                    <button
                        className="btn btn-tertiary"
                        onClick={handleApplyFilter}
                    >
                        Apply Filters
                    </button>
                    <button
                        className="btn btn-tertiary"
                        onClick={removeFilters}
                    >
                        Remove Filters
                    </button>
                </div>
            </div>
            {transactions.length > 0 ? (
                <div className="all-transactions">
                    <div className="transaction-headings">
                        <p className="transaction-heading-item transaction-heading-item-desc">
                            Description
                        </p>
                        <p className="transaction-heading-item">Category</p>
                        <p className="transaction-heading-item">Total Amount</p>
                        <p className="transaction-heading-item">Type</p>
                        <p className="transaction-heading-item">
                            Total Participants
                        </p>
                    </div>
                    {transactions.map((t) => {
                        return <EachTransaction transaction={t} key={t.id} />;
                    })}
                </div>
            ) : (
                <h3>No transactions so far</h3>
            )}
        </div>
    );
}

export default HomePage;
