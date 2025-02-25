import { useEffect, useState } from 'react';
import axios from '../axios';
import CreateProject from './CreateProject';
import { toast } from 'react-toastify';


const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [projectToEdit, setProjectToEdit] = useState(null); // Store project for editing
    const [showForm, setShowForm] = useState(false);
 
    useEffect(() => {
      fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
        const response = await axios.get('/auth/owner-projects', { withCredentials: true });
        if (Array.isArray(response.data)) {
            setProjects(response.data);
        } else {
            setProjects([]);
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Error fetching projects');
    } finally {
        setLoading(false);
    }
};

const handleEdit = (project) => {
  setProjectToEdit(project); // Set selected project
  setShowForm(true); // Show form
};

const handleProjectUpdated = () => {
  setShowForm(false); // Hide form after update
  setProjectToEdit(null);
  fetchProjects(); // Refresh projects
};

const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
        await axios.delete(`/auth/projects/${projectId}`, { withCredentials: true });
        toast.success("Project deleted successfully");
        fetchProjects(); // Refresh project list
    } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting project");
    }
};
 

    // const history = Navigate();

    // const handleEdit = (projectId) => {
    //     history.push(`/projects/edit/${projectId}`);
    // };

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <div className="projects-container p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Projects</h2>

      {showForm ? (
          <CreateProject projectToEdit={projectToEdit} onProjectUpdated={handleProjectUpdated} />
      ) : (
          <>
              {projects.length === 0 ? (
                  <p className="text-center text-gray-600">No projects found.</p>
              ) : (
                  <table className="projects-table w-full table-auto border-collapse">
                      <thead>
                          <tr className="bg-gray-200">
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Introduction</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {projects.map((project) => (
                              <tr key={project.id} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-2 text-sm text-gray-900">{project.name}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{project.introduction}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600">{project.status}</td>
                                  <td className="px-4 py-2 text-sm flex justify-center items-center">
                                  <button
                                          onClick={() => handleEdit(project)}
                                          className="bg-blue-600 text-white m-2 py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                                      >
                                          Edit
                                      </button>

                                      <button
                                                onClick={() => handleDelete(project.id)}
                                                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                                            >
                                                Delete
                                        </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}
          </>
      )}
  </div>
    );
};

export default ProjectsList;
