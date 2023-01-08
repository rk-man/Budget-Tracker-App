import { BACKEND_URL } from "../config";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import TransactionContext from "../contexts/transactionContext";

function EachParticipant({ participant, transaction }) {
    const { updateParticipant } = useContext(TransactionContext);

    const [participantData, setParticipantData] = useState({
        owner: participant.owner,
        isPaid: participant.isPaid,
        transaction: participant.transaction,
        amountOwes: participant.amountOwes,
    });

    useEffect(() => {
        setParticipantData({
            owner: participant.owner,
            isPaid: participant.isPaid,
            transaction: participant.transaction,
            amountOwes: participant.amountOwes,
        });
    }, [participant]);

    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (participantData && updating) {
            updateParticipant(participantData, participant.id);
            setUpdating(false);
        }
        // eslint-disable-next-line
    }, [participantData, updateParticipant]);

    const handleChangeParticipantData = (e) => {
        e.preventDefault();
        setParticipantData((prev) => {
            return {
                ...prev,
                [`${e.target.name}`]: e.target.value,
            };
        });
        setUpdating(true);
    };

    return (
        <div className="each-participant">
            <div className="each-participant-user-info">
                <div className="each-participant-profile-img-wrapper">
                    <img
                        src={`${BACKEND_URL}${participantData.owner.profileImage}`}
                        alt={participantData.owner.username}
                        className="profile-img"
                    />
                </div>
                <p className="each-participant-username">
                    {participantData.owner.username}
                </p>
            </div>
            {participantData.transaction.transactionType === "custom split" &&
            participantData.transaction.paidBy.id !=
                participantData.owner.id ? (
                <input
                    type="number"
                    value={participantData.amountOwes}
                    name="amountOwes"
                    onChange={handleChangeParticipantData}
                    className="each-participant-amount-input"
                />
            ) : (
                <p>{participantData.amountOwes}</p>
            )}

            <p>
                {participantData.isPaid
                    ? `${
                          participantData.transaction.paidBy.id ===
                          participantData.owner.id
                              ? "Person who paid for this !!!"
                              : `paid to ${participantData.transaction.paidBy.username}`
                      }`
                    : `yet to pay ${participantData.transaction.paidBy.username}`}
            </p>

            {participantData.transaction.paidBy.id !=
                participantData.owner.id &&
                participantData.transaction.transactionType != "treat" &&
                transaction.transactionType != "one-time" && (
                    <>
                        <p className="each-participant-paid-icon">
                            <input
                                type="checkbox"
                                name="isPaid"
                                onChange={(e) => {
                                    setParticipantData((prev) => {
                                        return {
                                            ...prev,
                                            isPaid: !prev.isPaid,
                                        };
                                    });
                                    setUpdating(true);
                                }}
                                checked={participantData.isPaid}
                                value={participantData.isPaid}
                            />
                            Paid
                        </p>
                    </>
                )}
        </div>
    );
}

export default EachParticipant;
