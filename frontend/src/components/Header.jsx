

import axios from "../axios";

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";


const Header = () => {

  const navigate = useNavigate();

  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();


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

  // Hide header on Sign In and Sign Up pages
  if (location.pathname === "/signin" || location.pathname === "/signup") {
    return null;
  }

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="text-2xl font-bold">
        <h1>My App</h1>
      </div>
      <nav>
        <ul className="flex space-x-6">
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              </li>
              <li>
                <div className="hover:text-gray-300 cursor-pointer" onClick={logoutUser}>Log Out</div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-gray-300">Sign In</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}


export default Header;
