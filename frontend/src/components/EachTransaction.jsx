
import { Link } from "react-router-dom";

function EachTransaction({ transaction }) {
    return (
        <Link
            to={`/transactions/${transaction.id}`}
            className="link each-transaction-wrapper"
        >
            <div className="each-transaction">
                <p className="each-transaction-item each-transaction-item-desc">
                    {transaction.shortDescription}
                </p>
                <p className="each-transaction-item">{transaction.category}</p>
                <p className="each-transaction-item">
                    {transaction.totalAmount}
                </p>
                <p className="each-transaction-item">
                    {transaction.transactionType}
                </p>
                <p className="each-transaction-item">
                    {transaction.participants.length}
                </p>
            </div>
        </Link>
    );
}

export default EachTransaction;
