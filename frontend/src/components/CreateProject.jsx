import { useState, useEffect } from 'react';
import axios from '../axios';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';


const CreateProject = ({ projectToEdit, onProjectUpdated }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [project, setProject] = useState({
    name: '',
    introduction: '',
    status: 'pending',
    startDateTime: '',
    endDateTime: ''
  });

  CreateProject.propTypes = {
    projectToEdit: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      introduction: PropTypes.string,
      status: PropTypes.string,
      startDateTime: PropTypes.string,
      endDateTime: PropTypes.string,
    }),
    onProjectUpdated: PropTypes.func
  };

  useEffect(() => {
    fetchUsers();
    if (projectToEdit) {
      setProject({
        name: projectToEdit.name || '',
        introduction: projectToEdit.introduction || '',
        status: projectToEdit.status || '',
        startDateTime: projectToEdit.startDateTime ? projectToEdit.startDateTime.split('.')[0] : '',
        endDateTime: projectToEdit.endDateTime ? projectToEdit.endDateTime.split('.')[0] : ''
      });
    }
  }, [projectToEdit]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/auth/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      toast.error('Error fetching users');
      console.log(error);

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
      if (projectToEdit) {
        // Update existing project
        // eslint-disable-next-line react/prop-types
        await axios.put(`/auth/projects/${projectToEdit.id}`, {
          ...project,
          members: selectedUsers,
          withCredentials: true
        });

        onProjectUpdated(); // Close the form after update
        toast.success('Project updated successfully');
      } else {
        // Create new project
        await axios.post('/auth/projects', {
          ...project,
          members: selectedUsers,
          withCredentials: true
        });
        toast.success('Project created successfully');
      }
    } catch (error) {
      toast.error('Error saving project');
      console.log(error);

    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {projectToEdit ? 'Edit Project' : 'Create New Project'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={project.name}
            placeholder="Project Name"
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="introduction"
            value={project.introduction}
            placeholder="Introduction"
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            value={project.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="started">Started</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="datetime-local"
            name="startDateTime"
            value={project.startDateTime}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="datetime-local"
            name="endDateTime"
            value={project.endDateTime}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <h3 className="text-lg font-semibold text-gray-700 mt-4">Assign Users:</h3>
          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded p-2">
            <div className="space-y-2">
              {users.map((user) => (
                <label key={user.id} className="flex items-center space-x-2 text-gray-700">
                  <input
                    type="checkbox"
                    onChange={() => handleUserSelection(user.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span>{user.name} ({user.email})</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200">
            {projectToEdit ? 'Update Project' : 'Create Project'}
          </button>
        </form>


      </div>

    </div>
  );
};

export default CreateProject;
