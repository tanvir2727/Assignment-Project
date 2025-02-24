import { useEffect, useState } from 'react';
import "./ProfilePage.css"
import axios from '../axios'; // Your axios instance
import { useNavigate } from 'react-router-dom';
import ProjectsList from './ProjectsList';


const Profile = () => {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/auth/profile', { withCredentials: true });
        console.log(response.data);  // Log the response to see what data is returned
        setUser(response.data);
        console.log(user);
      } catch (error) {
        setMessage(error.response ? error.response.data.message : 'Error fetching profile');
      }
    };
  
    fetchProfile();
  },[]);

  const handleCreateProject =()=>{
    navigate('/create-project')
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile</h2>
        {message && <p className="message">{message}</p>}
      </div>

      {user ? (
        <div className="user-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* Display other user details here */}
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}

      <div className="create-project-section">
        <button onClick={handleCreateProject} className="create-button">Create Project</button>
      </div>

      <div className="projects-list-section">
        <ProjectsList />
      </div>
    </div>
  );
};

export default Profile;
