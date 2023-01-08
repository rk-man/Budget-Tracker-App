import React, { useContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import AuthContext from "../contexts/authContext";
import "./../styles/auth.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function UserAccount() {
    const { updateUser, getMe, authUser } = useContext(AuthContext);

    const [userData, setUserData] = useState({
        username: "",
        name: "",
        email: "",
        phoneNo: "",
        id: "",
    });

    const [originalUserData, setOriginalUserData] = useState({
        username: "",
        name: "",
        email: "",
        phoneNo: "",
        id: "",
    });

    const [profileImage, setProfileImage] = useState({
        image: "",
        updated: false,
    });

    const [originalProfileImage, setOriginalProfileImage] = useState({
        image: "",
        updated: false,
    });

    const navigate = useNavigate();
    useEffect(() => {
        if (authUser.user && authUser.success) {
            toast.success("Updated Successfully");
            navigate("/");
        } else if (authUser.error && authUser.message) {
            toast.error(authUser.message);
            navigate("/");
        }
    }, []);

    useEffect(() => {
        getMe().then((res) => {
            setUserData({
                username: res.username,
                name: res.name ? res.name : "",
                email: res.email,
                phoneNo: res.phoneNo ? res.phoneNo : "",
                id: res.id,
            });
            setOriginalUserData({
                username: res.username,
                name: res.name ? res.name : "",
                email: res.email,
                phoneNo: res.phoneNo ? res.phoneNo : "",
                id: res.id,
            });

            imageUrlToBase64(`${BACKEND_URL}${res.profileImage}`).then(
                (res) => {
                    setProfileImage({
                        image: res,
                        updated: false,
                    });
                    setOriginalProfileImage({
                        image: res,
                        updated: false,
                    });
                }
            );
        });
    }, []);

    const convertToBase64String = (file) => {
        if (file === undefined) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setProfileImage({
                image: reader.result,
                updated: true,
            });
        };
    };

    const imageUrlToBase64 = (url) =>
        fetch(url)
            .then((response) => response.blob())
            .then(
                (blob) =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    })
            );

    const handleFileUpload = (e) => {
        e.preventDefault();
        convertToBase64String(e.target.files[0]);
    };

    const handleChangeUserData = (e) => {
        e.preventDefault();
        setUserData((prev) => {
            return {
                ...prev,
                [`${e.target.name}`]: e.target.value,
            };
        });
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        let data = {
            ...userData,
            profileImage: profileImage.image,
        };
        updateUser(data, userData.id).then((res) => {
            if (res.user) {
                toast.success("Updated Succesfully");
                navigate("/");
            } else {
                toast.error("Couldn't update data");
                navigate("/");
            }
        });
    };

    const resetChanges = (e) => {
        e.preventDefault();
        setProfileImage(originalProfileImage);
        setUserData(originalUserData);
    };

    return (
        <div className="form-wrapper">
            <form className="form" onSubmit={handleUpdateUser}>
                <div className="profile-img-wrapper">
                    <img
                        src={profileImage.image}
                        alt={userData.username}
                        className="profile-img"
                    />
                </div>
                <input type="file" onChange={handleFileUpload} />
                <div className="form-field">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-input"
                        value={userData.username}
                        onChange={handleChangeUserData}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        value={userData.email}
                        onChange={handleChangeUserData}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        value={userData.name}
                        onChange={handleChangeUserData}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="phoneNo" className="form-label">
                        Phone No
                    </label>
                    <input
                        type="text"
                        id="phoneNo"
                        name="phoneNo"
                        className="form-input"
                        value={userData.phoneNo}
                        onChange={handleChangeUserData}
                    />
                </div>

                <div className="btns-container" style={{ marginTop: "2rem" }}>
                    <button className="btn btn-primary" type="Submit">
                        Save Changes
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={resetChanges}
                    >
                        Reset Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserAccount;
