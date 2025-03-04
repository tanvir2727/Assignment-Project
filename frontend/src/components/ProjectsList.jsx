import { useEffect, useState } from 'react';
import axios from '../axios';
import CreateProject from './CreateProject';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Box, TablePagination
} from '@mui/material';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5); // Fixed 5 items per page

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/auth/owner-projects', { withCredentials: true });
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setProjectToEdit(project);
    setShowForm(true);
  };

  const handleProjectUpdated = () => {
    setShowForm(false);
    setProjectToEdit(null);
    fetchProjects();
  };

  const handleDelete = async (projectId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/auth/projects/${projectId}`, { withCredentials: true });
        toast.success("Delete Successfully");
        fetchProjects();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Error deleting project",
          icon: "error"
        });
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) return <Typography align="center">Loading projects...</Typography>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Box p={4} component={Paper} elevation={3}>
      <Typography variant="h5" align="center" gutterBottom>
        My Projects
      </Typography>

      {showForm ? (
        <CreateProject projectToEdit={projectToEdit} onProjectUpdated={handleProjectUpdated} />
      ) : (
        <>
          {projects.length === 0 ? (
            <Typography align="center" color="textSecondary">No projects found.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Introduction</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell align="center"><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
                    <TableRow key={project.id} hover>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.introduction}</TableCell>
                      <TableCell>{project.status}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(project)}
                          style={{ marginRight: '8px' }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(project.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                count={projects.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
              />
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default ProjectsList;
