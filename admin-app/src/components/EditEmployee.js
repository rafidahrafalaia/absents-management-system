import React, { useState, useEffect, useRef } from 'react';
import { fetchToken } from './Auth.js';
import { useParams } from 'react-router-dom';
import api from '../api/api.js';

function EditEmployee() {
    const defaultAvatar = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png';
    let auth = fetchToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': auth,
    };
    const { id } = useParams();

    const [formData, setFormData] = useState({
        avatar: defaultAvatar,
        username: '',
        email: '',
        password: '',
        jabatan: '',
        office_number: '',
        personal_number: '',
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        api.get(`/read/${id}`, { headers })
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
        const { name, value, files } = e.target;
        if (name === 'avatar') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                avatar: files[0] ? files[0] : prevFormData.avatar,
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
                avatar: files[0],
            }));
        }

        const avatarFormData = new FormData();
        avatarFormData.append('avatar', files[0]);
        try {
            const response = await api.post(`/upload/${id}`, avatarFormData, {
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
        await api.put(`/update/${id}`, formData, { headers });
        alert('User is updated!!');
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const handleEditPasswordClick = () => {
        setIsEditingPassword((prevValue) => !prevValue);
    };

    return (
        <div className="d-flex flex-column align-items-center pt-4">
            {/* <h2>Edit Employee</h2> */}
            <form className="row g-3 w-50 form-center" onSubmit={handleSubmit}>
                {/* Avatar input */}
                <div className="col-12 d-flex justify-content-center">
                    <img
                        src={formData.avatar}
                        alt="Avatar Preview"
                        className="avatar-preview"
                        onClick={handleAvatarClick}
                    />
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleChangeAvatar}
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Username input */}
                <div className="col-12">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" value={formData.username}
                    onChange={handleChange} required />
                </div>

                {/* Email input */}
                <div className="col-12">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={formData.email}
                    onChange={handleChange} required />
                </div>

                {/* Password input */}
                {isEditingPassword && (
                    <div className="col-12">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name="password" value={formData.password}
                        onChange={handleChange} />
                    </div>
                )}

                {/* Toggle button for editing password */}
                <div className="col-12">
                    <button type="button" className="btn btn-secondary" onClick={handleEditPasswordClick}>
                        {isEditingPassword ? 'Hide Password' : 'Edit Password'}
                    </button>
                </div>

                {/* Jabatan input */}
                <div className="col-12">
                    <label className="form-label">Jabatan</label>
                    <input type="text" className="form-control" id="jabatan" name="jabatan" value={formData.jabatan}
                    onChange={handleChange} required />
                </div>

                {/* Personal Number input */}
                <div className="col-12">
                    <label className="form-label">Personal Number</label>
                    <input type="text" className="form-control" id="personal_number" name="personal_number" value={formData.personal_number}
                    onChange={handleChange} required />
                </div>

                {/* Office Number input */}
                <div className="col-12">
                    <label className="form-label">Office Number</label>
                    <input type="text" className="form-control" id="office_number" name="office_number" value={formData.office_number}
                    onChange={handleChange} required />
                </div>

                {/* Submit button */}
                <div className="col-12 d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary">Update</button>
                </div>
            </form>
        </div>
    );
}

export default EditEmployee;
