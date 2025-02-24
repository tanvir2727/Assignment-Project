import { useState, useEffect } from 'react';
import "./CreateProjectPage.css"
import axios from '../axios';
import { ToastContainer,toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 

const CreateProject = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [project, setProject] = useState({
        name: '',
        introduction: '',
        status: '',
        startDateTime: '',
        endDateTime: ''
    });
    
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/auth/users', { withCredentials: true }); 
            setUsers(response.data);
            console.log(response.data);
        } catch (error) {
            toast.error('Error fetching users')
            console.error('Error fetching users:', error.response?.data || error.message);
        }
    };

    const handleInputChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/projects', {
                ...project,
                members: selectedUsers,
                withCredentials: true
            });
            alert(response.data.message);
            toast.success('success')
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div className="create-project-container">
        <h2 className="create-project-title">Create New Project</h2>
  
        <form onSubmit={handleSubmit} className="create-project-form">
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="text"
            name="introduction"
            placeholder="Introduction"
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="datetime-local"
            name="startDateTime"
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="datetime-local"
            name="endDateTime"
            onChange={handleInputChange}
            className="input-field"
          />
  
          <h3 className="assign-users-title">Assign Users:</h3>
          {users.map((user) => (
            <label key={user.id} className="user-checkbox-label">
              <input
                type="checkbox"
                onChange={() => handleUserSelection(user.id)}
                className="user-checkbox"
              />
              {user.name} ({user.email})
            </label>
          ))}
  
          <button type="submit" className="submit-button">Create Project</button>
        </form>
  
        <ToastContainer />
      </div>
    );
};

export default CreateProject;
