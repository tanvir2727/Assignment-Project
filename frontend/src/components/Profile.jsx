import { useEffect, useState } from 'react';
import axios from '../axios'; // Your axios instance
import ProjectsList from './ProjectsList';
import 'react-pro-sidebar/dist/css/styles.css';
import SideBar from './SideBar';

const Profile = () => {
  const [user, setUser] = useState({});
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/auth/profile', { withCredentials: true });
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);


  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <SideBar></SideBar>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center">
          {user ? (
            <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg text-center">
              <p className="text-lg">
                <strong>Name:</strong> {user.name}
              </p>
              <p className="text-lg">
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">Loading...</p>
          )}

          {/* Project List */}
          <div className="container w-full mt-6">
            <ProjectsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
