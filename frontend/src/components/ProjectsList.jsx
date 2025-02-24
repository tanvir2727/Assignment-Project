import { useEffect, useState } from 'react';
import "./MyProjectsPage.css"
import axios from '../axios';

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/auth/owner-projects', { withCredentials: true });
                
                // console.log('API Response:', response.data); // Debugging

                if (Array.isArray(response.data)) {
                    setProjects(response.data);
                    console.log(response.data);
                     // Set projects if valid array
                } else {
                    setProjects([]); // Fallback to empty array
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="projects-container">
      <h2>My Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <table className="projects-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Introduction</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.introduction}</td>
                <td>{project.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    );
};

export default ProjectsList;
