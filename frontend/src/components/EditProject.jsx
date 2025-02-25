import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from '../axios';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 

const EditProject = () => {
    const { projectId } = useParams(); // Get projectId from URL params
    const history = Navigate();

    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [project, setProject] = useState({
        name: '',
        introduction: '',
        status: 'pending',
        startDateTime: '',
        endDateTime: ''
    });

    useEffect(() => {
        fetchProjectDetails();
        fetchUsers();
    }, []);

    // Fetch the existing project details
    const fetchProjectDetails = async () => {
        try {
            const response = await axios.get(`/projects/${projectId}`, { withCredentials: true });
            setProject({
                name: response.data.name,
                introduction: response.data.introduction,
                status: response.data.status,
                startDateTime: response.data.startDateTime,
                endDateTime: response.data.endDateTime
            });
            setSelectedUsers(response.data.members || []);
        } catch (error) {
            toast.error('Error fetching project details');
            console.error('Error fetching project:', error);
        }
    };

    // Fetch all users (for assigning members)
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/auth/users', { withCredentials: true });
            setUsers(response.data);
        } catch (error) {
            toast.error('Error fetching users');
            console.error('Error fetching users:', error);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    // Handle user selection
    const handleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/projects/${projectId}`, {
                ...project,
                members: selectedUsers,
                withCredentials: true
            });
            console.log(response);
            
            toast.success('Project updated successfully');
            history.push('/projects'); // Redirect back to projects page
        } catch (error) {
            toast.error('Error updating project');
            console.error('Error updating project:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Edit Project</h2>

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
                    <div className="space-y-2">
                        {users.map((user) => (
                            <label key={user.id} className="flex items-center space-x-2 text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleUserSelection(user.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span>{user.name} ({user.email})</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => history.push('/projects')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>

                <ToastContainer />
            </div>
        </div>
    );
};

export default EditProject;
