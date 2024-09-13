import React, { useState } from 'react';

interface AddUserProps {
    handleClose: () => void;
    getUser: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ handleClose, getUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});

    const validate = () => {
        const newErrors: { name?: string; email?: string; password?: string } = {};
        if (!name) newErrors.name = 'Name is required.';
        if (!email) newErrors.email = 'Email is required.';
        if (!password) newErrors.password = 'Password is required.';
        return newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch('/api/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User created:', data.user);
                handleClose();
                getUser();
            } else {
                const errorData = await response.json();
                setErrors({ general: errorData.error || 'Failed to create user.' });
            }
        } catch (err) {
            setErrors({ general: 'An error occurred. Please try again.' });
            console.error('Error:', err);
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
            <h5>Add New User</h5>
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
            {errors.password && <div style={{ color: 'red', fontSize:'14px' }}>{errors.password}</div>}
            <div className='set-button'>
                <button className='save-btn' onClick={handleSave}>
                    Save
                </button>
                <button className='ml-2 cancel-btn' onClick={handleClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddUser;
