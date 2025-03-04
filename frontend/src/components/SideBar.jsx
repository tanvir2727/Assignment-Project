import { useNavigate, Link } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { FaPlus, FaList, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import 'react-pro-sidebar/dist/css/styles.css';
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import axios from "../axios";


const SideBar = () => {
    const navigate = useNavigate();

    const { logout } = useAuth();

    const handleCreateProject = () => {
        navigate('/create-project');
    };

    const handleSeeAllProject = () => {
        navigate('/all-project');
    };

    const logoutUser = async () => {
        try {
          // Perform logout
          await axios.post("/auth/logout", {}, { withCredentials: true });
          // const token =localStorage.removeItem('accessToken');
          logout();
          // Show success toast
          toast.success("Logged out successfully!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
    
          // Redirect after successful logout 
          navigate('/signin');
        } catch (error) {
          toast.error("Error logging out");
          console.error("Logout error:", error);
        }
      };


    return (
        <div>
            <ProSidebar
                style={{
                    height: "100vh",
                    background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                    color: "white",
                }}
                collapsed={false} // Set to true for collapsed sidebar
            >
                <Menu iconShape="square">
                    <MenuItem
                        icon={<FaPlus />}
                        onClick={handleCreateProject}
                        style={{ fontSize: "16px", fontWeight: "bold", padding: "12px" }}
                    >
                        Create Project
                    </MenuItem>
                    <MenuItem
                        icon={<FaList />}
                        onClick={handleSeeAllProject}
                        style={{ fontSize: "16px", fontWeight: "bold", padding: "12px" }}
                    >
                        All Projects
                    </MenuItem>
                    <MenuItem
                        icon={<FaUserCircle />}
                        style={{ fontSize: "16px", fontWeight: "bold", padding: "12px" }}
                    >
                        <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
                            Profile
                        </Link>
                    </MenuItem>

                    <MenuItem
                        icon={<FaSignOutAlt />}
                        style={{ fontSize: "16px", fontWeight: "bold", padding: "12px" }}
                        onClick={logoutUser}
                    >
                        Log Out
                    </MenuItem>
                </Menu>
            </ProSidebar>
        </div>
    )
}

export default SideBar
