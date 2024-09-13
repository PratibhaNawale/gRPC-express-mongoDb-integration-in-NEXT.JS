import React, { useEffect, useState } from 'react';
import AddUser from './AddUser';
import EditUser from './EditUser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [openEditSidebar, setOpenEditSidebar] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(null);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setOpenEditSidebar(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const handleOpenAddUser = () => {
        setOpenSidebar(true);
    };

    const handleCloseSidebar = () => {
        setOpenSidebar(false);
        setOpenEditSidebar(false);
        setSelectedUser(null);
    };

    const getUser = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (searchQuery) {
                queryParams.append('query', searchQuery);
            }
            const res = await fetch(`/api/getUser?${queryParams.toString()}`);
            if (!res.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await res.json();
            console.log('Fetched users:', data.users);
            if (data.users) {
                setUsers(data.users);
            } else {
                setUsers([]);
            }
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    };


    const confirmDelete = (id: string) => {
        setUserIdToDelete(id);
        setShowDeletePopup(true);
    };

    const closeDeletePopup = () => {
        setShowDeletePopup(false);
        setUserIdToDelete(null);
    };

    const deleteCustomerRequests = async () => {
        if (userIdToDelete) {
            try {
                const res = await fetch('/api/deleteUser', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: userIdToDelete }),
                });

                if (!res.ok) {
                    throw new Error('Failed to delete user');
                }
                toast.success('User deleted successfully');

                await getUser();
                closeDeletePopup();
            } catch (err) {
                console.error('Error deleting user:', err);
                setError('Error deleting user');
            }
        }
    };

    useEffect(() => {
        getUser();
    }, [searchQuery]);
    return (
        <div className='p-4 main'>
            <div className='d-flex'>
                <div>
                    <h5 >Your Account, Your Way</h5>
                    <p >Customize, Manage, and Optimize Your User Experience</p>
                </div>
                <div>
                    <input
                        type='text'
                        placeholder='Search Name or Email'
                        className='search-input'
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <div>

                    <button onClick={handleOpenAddUser} className='add-btn'>Add User</button>
                    {openSidebar && <AddUser handleClose={handleCloseSidebar} getUser={getUser} />}
                </div>
            </div>


            {openEditSidebar && selectedUser && (
                <EditUser
                    handleClose={handleCloseSidebar}
                    userId={selectedUser.id}
                    select={selectedUser}
                    getUser={getUser}
                />
            )}

            <table className='table mt-3'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>
                                <button onClick={() => handleEdit(user)} className='save-btn'>Edit</button>
                                <button className='ml-3 delete-btn' onClick={() => confirmDelete(user.id)} >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDeletePopup && (
                <div className="popup-box">
                    <div className="cust-box">
                        <p className="text-center">Are you sure you want to delete this User?</p>
                        <button onClick={deleteCustomerRequests} className="cust-yes">Yes</button>
                        <button onClick={closeDeletePopup} className="cust-no">No</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserTable;
