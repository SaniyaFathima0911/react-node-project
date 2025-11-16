import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './App.css';

const avatarOptions = [
  '/images/avatar-1.jpg',
  '/images/avatar-2.jpg',
  '/images/avatar-3.jpg',
  '/images/avatar-4.jpg',
];

// const API_URL = 'http://localhost:5001/api/users';
const API_URL = "https://react-node-project-smtd.onrender.com/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', email: '', number: '', avatar: avatarOptions[0] });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      const usersWithId = response.data.map(user => ({ ...user, id: user._id }));
      setUsers(usersWithId);
    } catch (err) {
      setError('Could not fetch users. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name' && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateNumber = (number) => /^[0-9]{10}$/.test(number);

  const validateForm = () => {
    if (!form.name) {
      setError('Name is required and must only contain letters.');
      return false;
    }
    if (!form.email || !validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!form.number || !validateNumber(form.number)) {
      setError('Please enter a valid 10-digit number.');
      return false;
    }
    setError('');
    return true;
  };

  const resetForm = () => {
    setForm({ id: null, name: '', email: '', number: '', avatar: avatarOptions[0] });
    setIsEditing(false);
    setError('');
  };


  const addUser = async () => {
    if (!validateForm()) return;

    try {
      const newUser = { 
        name: form.name, 
        email: form.email, 
        number: form.number, 
        avatar: form.avatar 
      };
      
      await axios.post(API_URL, newUser);
      
      fetchUsers(); 
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user.');
    }
  };

  const updateUser = async () => {
    if (!validateForm()) return;

    try {
      const updatedUser = { 
        name: form.name, 
        email: form.email, 
        number: form.number, 
        avatar: form.avatar 
      };
      
      await axios.put(`${API_URL}/${form.id}`, updatedUser);

      fetchUsers();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  const editUser = (user) => {
    setForm(user);
    setIsEditing(true);
    setError('');
  };

  return (
    <div>
      <h1>User Profiles</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* --- Form --- */}
      <input
        type="text"
        name="name"
        placeholder="Enter name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={form.email}
        onChange={handleChange}
      />
      {/* Changed type to "text" to work better with regex validation */}
      <input
        type="text" 
        name="number"
        placeholder="Enter 10-digit number"
        value={form.number}
        onChange={handleChange}
        maxLength="10"
      />

      {/* Avatar Selection */}
      <div className="avatar-selection">
        <p>Select Avatar:</p>
        <div>
          {avatarOptions.map((avatar, index) => (
            <label key={index}>
              <input
                type="radio"
                name="avatar"
                value={avatar}
                checked={form.avatar === avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              />
              <img src={avatar} alt={`avatar ${index + 1}`} width="50" />
            </label>
          ))}
        </div>
        {/* Buttons */}
        {isEditing ? (
          <button onClick={updateUser}>Update User</button>
        ) : (
          <button onClick={addUser}>Add User</button>
        )}
      </div>
      <hr />

      {/* --- Display Users --- */}
      <div className="users-container">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img src={user.avatar} alt={user.name} />
            <div className="user-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <p>{user.number}</p>
            </div>
            <div className="user-actions">
              <button className="edit" onClick={() => editUser(user)}>Edit</button>
              <button className="delete" onClick={() => deleteUser(user.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
