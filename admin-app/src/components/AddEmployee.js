import api from '../api/api.js';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchToken } from './Auth.js';

function AddEmployee() {
    let auth = fetchToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': auth,
    };
    const defaultAvatar = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png';
    const [formData, setFormData] = useState({
        avatar: defaultAvatar,
        username: '',
        email: '',
        jabatan: '',
        office_number: '',
        personal_number: '',
    });

    const [registerStatus, setRegisterStatus] = useState("");
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const create = async (e) => {
        e.preventDefault();
        console.log(formData,"ansjansjna")
        await api.post("/register", formData, {headers})
            .then(response => {
                console.log(response.data,"aapksp")
                if (response.data.message) {
                    setRegisterStatus(response.data.message);
                } else {
                    navigate('/');
                    alert("Success");
                }
            })
            .catch(err => console.log(err));
    };

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

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="d-flex flex-column align-items-center pt-4">
            {/* <h2>Add Employee</h2> */}
            <form className="row g-3 w-50 form-center" onSubmit={create}>
                <h1 style={{ fontSize: '15px', textAlign: 'center', marginTop: '20px' }}>{registerStatus}</h1>

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
                        onChange={handleChange}
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

                {/* Jabatan input */}
                <div className="col-12">
                    <label className="form-label">Jabatan</label>
                    <input type="text" className="form-control" id="jabatan" name="jabatan" value={formData.jabatan}
                    onChange={handleChange} required />
                </div>

                {/* Personal Number input */}
                <div className="col-12">
                    <label className="form-label">Personal Number</label>
                    <input type="text" className="form-control" id="personal_number" name="personal_number"
                    value={formData.personal_number} onChange={handleChange} required />
                </div>

                {/* Office Number input */}
                <div className="col-12">
                    <label className="form-label">Office Number</label>
                    <input type="text" className="form-control" id="office_number" name="office_number"
                    value={formData.office_number} onChange={handleChange} required />
                </div>

                {/* Submit button */}
                <div className="col-12 d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
    );
}

export default AddEmployee;
