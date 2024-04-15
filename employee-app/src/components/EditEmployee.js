import React, { useState, useEffect, useRef } from 'react';
import { fetchToken } from './Auth.js';
import api from '../api/api.js';

function EditEmployee() {
    const defaultAvatar = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png';
    let auth = fetchToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': auth,
    };

    const [formData, setFormData] = useState({
        avatar: defaultAvatar,
        username: '',
        email: '',
        password: '',
        jabatan: '',
        office_number: '',
        personal_number: '',
    });

    const fileInputRef = useRef(null); // Reference to the file input

    useEffect(() => {
        api.get("/read", { headers })
            .then(res => {
                if (res.data.data) {
                    setFormData({
                        avatar: res.data.data.avatar === null || res.data.data.avatar.length === 0 ? defaultAvatar : res.data.data.avatar,
                        username: res.data.data.username,
                        email: res.data.data.email,
                        jabatan: res.data.data.jabatan,
                        office_number: res.data.data.office_number,
                        personal_number: res.data.data.personal_number,
                        password: '',
                    });
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value, files } = e.target;
        if (name === 'avatar') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                avatar: files[0] ? URL.createObjectURL(files[0]) : prevFormData.avatar,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleChangeAvatar = async (e) => {
        e.preventDefault();
        const { files } = e.target;
        if (files && files[0]) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                avatar: URL.createObjectURL(files[0]),
            }));
        }

        const avatarFormData = new FormData();
        avatarFormData.append('avatar', files[0]);
        try {
            const response = await api.post('/upload', avatarFormData, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert(response.data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.put(`/update`, formData, { headers });
        alert('User is updated!!');
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const [isEditingPassword, setIsEditingPassword] = useState(false);

    useEffect(() => {
        api.get("/read", { headers })
            .then(res => {
                if (res.data.data) {
                    setFormData({
                        avatar: res.data.data.avatar === null || res.data.data.avatar.length === 0 ? defaultAvatar : res.data.data.avatar,
                        username: res.data.data.username,
                        email: res.data.data.email,
                        jabatan: res.data.data.jabatan,
                        office_number: res.data.data.office_number,
                        personal_number: res.data.data.personal_number,
                        password: '',
                    });
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleEditPasswordClick = () => {
        setIsEditingPassword((prevValue) => !prevValue);
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            {/* Avatar input */}
            <div className="avatar-container">
                {/* Preview the avatar */}
                <img
                    src={formData.avatar}
                    alt="Avatar Preview"
                    className="avatar-preview"
                    onClick={handleAvatarClick} // Trigger file input when avatar image is clicked
                />

                {/* Hidden file input */}
                <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    ref={fileInputRef} // Reference to the file input
                    onChange={handleChangeAvatar}
                    style={{ display: 'none' }} // Hide the file input
                />
            </div>

            {/* Other form fields */}
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            {isEditingPassword && (
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
           
        )}

        {/* Toggle button for editing password */}
        <div>
            <button
                type="button"
                className="edit-password-btn"
                onClick={handleEditPasswordClick}
            >
                {isEditingPassword ? 'Hide Password' : 'Edit Password'}
            </button>
        </div>

        <div>
            <label htmlFor="jabatan">Jabatan:</label>
            <input
                type="text"
                id="jabatan"
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                required
            />
        </div>

        <div>
            <label htmlFor="personal_number">Personal Number:</label>
            <input
                type="text"
                id="personal_number"
                name="personal_number"
                value={formData.personal_number}
                onChange={handleChange}
                required
            />
        </div>

        <div>
            <label htmlFor="office_number">Office Number:</label>
            <input
                type="text"
                id="office_number"
                name="office_number"
                value={formData.office_number}
                onChange={handleChange}
                required
            />
        </div>

        {/* Submit button */}
        <button type="submit" className="submit-btn">Submit</button>
    </form>
);
}

export default EditEmployee;
