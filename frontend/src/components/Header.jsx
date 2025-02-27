
import axios from "../axios";

import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Header = () => {
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      // Perform logout
      await axios.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem('accessToken');

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
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="text-2xl font-bold">
        <h1>My App</h1> {/* You can replace this with a logo image if needed */}
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/profile" className="nav-link hover:text-gray-300">Profile</Link>
          </li>
          <li>
            <Link to="/signin" className="nav-link hover:text-gray-300">Sign In</Link>
          </li>
          <li>
            <Link to="/signup" className="nav-link hover:text-gray-300">Sign Up</Link>
          </li>
          <li>
            <div className="nav-link hover:text-gray-300 cursor-pointer" onClick={logoutUser}>Log out</div>
          </li>

        </ul>
      </nav>
    </header>
  );
}


export default Header;
