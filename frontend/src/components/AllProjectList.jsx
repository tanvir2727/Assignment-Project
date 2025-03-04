import { useEffect, useState } from "react";
import axios from "../axios";
import { toast } from 'react-toastify';
import SideBar from "./SideBar";

const AllProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/auth/getAllProject", { withCredentials: true });
        console.log('Full Api Response', response);

        setProjects(response.data.projects);
        console.log(projects);


      } catch (err) {
        setProjects([])
        setError("Failed to load projects", err);
        console.error(err)
      }
    };
    fetchProjects();
  }, []);

  // Function to generate and download PDF
  const handleGeneratePDF = async () => {
    try {
      // Make the GET request with proper configuration
      const response = await axios.get('/auth/generate-pdf', {
        withCredentials: true,
        responseType: 'blob',  // Correctly placed in the config object
      });
  
      // Create a link to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Project_Report.pdf'); // Ensure file extension is added
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };
  

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SideBar></SideBar>
      <div className='flex-1 p-6 '>
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Project List</h2>

      <button onClick={handleGeneratePDF} className="bg-blue-600 text-white px-4 py-2 rounded">Generate PDF</button>
      <br />
      <br />
      <div className="overflow-x-auto">
        <table className="projects-table w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Project Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Introduction</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Owner</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(projects) && projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id} className="text-left border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">{project.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{project.introduction}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{project.status}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{project.ownerName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-600 p-4">No projects found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>

  );
};

export default AllProjectList;
