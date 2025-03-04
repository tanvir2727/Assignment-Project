import { useEffect, useState } from "react";
import axios from "../axios";
import { toast } from 'react-toastify';
import SideBar from "./SideBar";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TablePagination } from '@mui/material';

const AllProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/auth/getAllProject", { withCredentials: true });
        setProjects(response.data.projects);
      } catch (err) {
        setProjects([]);
        setError("Failed to load projects");
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const handleGeneratePDF = async () => {
    try {
      const response = await axios.get('/auth/generate-pdf', {
        withCredentials: true,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Project_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="grey.100">
      <SideBar />
      <Box flex={1} p={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Project List
        </Typography>

        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button variant="contained" color="primary" onClick={handleGeneratePDF}>
            Generate PDF
          </Button>
        </Box>

        {error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5", height: "48px" }}> {/* Fixed header height */}
                    <TableCell sx={{ py: 1, minWidth: 150, textAlign: "center" }}><b>Project Name</b></TableCell>
                    <TableCell sx={{ py: 1, minWidth: 250, textAlign: "center" }}><b>Introduction</b></TableCell>
                    <TableCell sx={{ py: 1, minWidth: 100, textAlign: "center" }}><b>Status</b></TableCell>
                    <TableCell sx={{ py: 1, minWidth: 150, textAlign: "center" }}><b>Owner</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
                    <TableRow key={project.id} sx={{ height: "48px" }}> {/* Fixing row height */}
                      <TableCell sx={{ py: 1, minWidth: 150, textAlign: "center", whiteSpace: "nowrap" }}>
                        {project.name}
                      </TableCell>
                      <TableCell sx={{ py: 1, minWidth: 250, textAlign: "center" }}>
                        {project.introduction}
                      </TableCell>
                      <TableCell sx={{ py: 1, minWidth: 100, textAlign: "center", whiteSpace: "nowrap" }}>
                        {project.status}
                      </TableCell>
                      <TableCell sx={{ py: 1, minWidth: 150, textAlign: "center", whiteSpace: "nowrap" }}>
                        {project.ownerName}
                      </TableCell>
                    </TableRow>
                  ))}
                  {projects.length === 0 && (
                    <TableRow sx={{ height: "48px" }}>
                      <TableCell colSpan={4} align="center" sx={{ py: 1 }}>
                        No projects found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={projects.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default AllProjectList;
