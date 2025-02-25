import { useEffect } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
    const navigate = useNavigate();
    

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axios.post("/auth/logout",{ withCredentials: true });
                localStorage.removeItem('accessToken');
                toast.success("Logged out successfully!");
                navigate('/signin');
                 // Redirect to login page
            } catch (error) {
                toast.error("Error logging out");
                console.error("Logout error:", error);
            }
        };
        
        logoutUser();
        
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axios.post("/logout");
            toast.success("Logged out successfully!");
            navigate("/login");
        } catch (error) {
            toast.error("Error logging out");
            console.error("Logout error:", error);
        }
    };
    return(
        <>
        <button onClick={handleLogout}>
            logout
        </button>
        </>
    )
        
    
};

export default Logout;
