import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import api from '../api/api.js';
import { fetchToken } from './Auth.js';

function AbsentEmployee() {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [itemsLength, setItemsLength] = useState(itemsPerPage);

    let auth = fetchToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': auth
    };

    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleEdit = (id) => {
        // Redirect to the edit page with the user ID as a parameter
        navigate(`/edit/${id}`);
    };

    useEffect(() => {
        if (message) {
            alert(message);
        }
    }, [message]);

    useEffect(() => {
        api.get(`/getAllAbsents?page=${currentPage}&limit=${itemsPerPage}`, { headers })
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
                            <th>E-mail</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Time</th> {/* Add "Actions" column header */}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((absent, index) => (
                            <tr key={index}>
                                <td>{absent.users.username}</td>
                                <td>{absent.users.email}</td>
                                <td>{absent.date}</td>
                                <td>{absent.type}</td>
                                <td>{absent.time}</td>
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
                {/* Create buttons for each page number */}
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

export default AbsentEmployee;
