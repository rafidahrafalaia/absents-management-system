import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../api/api.js';
import { fetchToken } from './Auth.js';

function Home() {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [itemsLength, setItemsLength] = useState(itemsPerPage);

    let auth = fetchToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': auth
    };

    const navigate = useNavigate(); 

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    useEffect(() => {
        if (message) {
            alert(message);
        }
    }, [message]);

    useEffect(() => {
        api.get(`/readAll?page=${currentPage}&limit=${itemsPerPage}`, { headers })
            .then(res => {
                setData(res.data.data);
                setItemsLength(res.data.total);
            })
            .catch(err => console.log(err));
    }, [currentPage, itemsPerPage]);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='px-5 py-3'>
            <div className='d-flex justify-content-center mt-2'>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Jabatan</th>
                            <th>E-mail</th>
                            <th>Office Number</th>
                            <th>Phone Number</th>
                            <th>Actions</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user, index) => (
                            <tr key={index}>
                                <td>{user.username}</td>
                                <td>{user.jabatan}</td>
                                <td>{user.email}</td>
                                <td>{user.office_number}</td>
                                <td>{user.personal_number}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(user.id)} 
                                        className="edit-button" 
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Previous
                </button>
                {Array.from({ length: Math.ceil(itemsLength / itemsPerPage) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(itemsLength / itemsPerPage)}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Home;
