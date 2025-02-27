import { useEffect, useState } from 'react';
import axios from '../axios'; // Your axios instance
import { useNavigate } from 'react-router-dom';
import ProjectsList from './ProjectsList';



const Profile = () => {
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/auth/profile', { withCredentials: true });
        console.log(response.data);  // Log the response to see what data is returned
        setUser(response.data);
        console.log(user);
      } catch (error) {
         console.log(error);
         
      }
    };
    fetchProfile();
  },[]);

  const handleCreateProject =()=>{
    navigate('/create-project')
  }

  const handleSeeAllProject =()=>{
    navigate('/all-project')
  }

  return (
    <>
    <div className="min-h-screen  bg-gray-100 flex flex-col items-center">
      

      {user ? (
        <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg text-center mt-4">
          <p className="text-lg"><strong>Name:</strong> {user.name}</p>
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          {/* Display other user details here */}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Loading...</p>
      )}

      <div className="mt-6 items-center">
        <button 
          onClick={handleCreateProject} 
          className="bg-blue-600 text-white m-2 py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Create Project
        </button>

        <button 
          onClick={handleSeeAllProject} 
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          All Project
        </button>
      </div>

      <div className="w-full  mt-6">
        <ProjectsList />
      </div>
    </div>
    </>
  );
};

export default Profile;
