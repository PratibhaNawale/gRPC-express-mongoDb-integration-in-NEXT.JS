import React, { useState } from 'react';

interface EditUserProps {
    handleClose: () => void;
    select: {
        id: string;
        name: string;
        email: string;
        password: string;
    };
    getUser: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ handleClose, select, getUser }) => {
    const [name, setName] = useState(select.name);
    const [email, setEmail] = useState(select.email);
    const [password, setPassword] = useState(select.password);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { name?: string; email?: string; password?: string } = {};
        if (!name) newErrors.name = 'Name is required.';
        if (!email) newErrors.email = 'Email is required.';
        if (!password) newErrors.password = 'Password is required.';
        return newErrors;
    };

    const handleUpdate = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await fetch(`/api/updateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: select.id, name, email, password }),
            });
            if (!res.ok) {
                throw new Error('Failed to update user');
            }
            getUser();
            handleClose();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    };

    return (
        <div className='open-sidebar'>
            <h5>Update User</h5>
            <label>Name</label>
            <input
                type='text'
                placeholder='Enter Name'
                value={name}
                onChange={handleNameChange}
                style={{ borderColor: errors.name ? 'red' : undefined }}
            />
            {errors.name && <div style={{ color: 'red' , fontSize:'14px'}}>{errors.name}</div>}
            <label>Email</label>
            <input
                type='text'
                placeholder='Enter Email'
                value={email}
                onChange={handleEmailChange}
                style={{ borderColor: errors.email ? 'red' : undefined }}
            />
            {errors.email && <div style={{ color: 'red' , fontSize:'14px'}}>{errors.email}</div>}
            <label>Password</label>
            <input
                type='text'
                placeholder='Enter Password'
                value={password}
                onChange={handlePasswordChange}
                style={{ borderColor: errors.password ? 'red' : undefined }}
            />
            {errors.password && <div style={{ color: 'red',fontSize:'14px' }}>{errors.password}</div>}
            <div className='set-button'>
                <button className='save-btn' onClick={handleUpdate}>
                    Update
                </button>
                <button className='ml-2 cancel-btn' onClick={handleClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditUser;
