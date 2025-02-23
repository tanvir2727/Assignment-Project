import { useEffect, useState } from 'react';
import axios from '../axios'; // Your axios instance

const Profile = () => {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

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

  return (
    <div>
      <h2>Profile</h2>
      {message && <p>{message}</p>}
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* Display other user details here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
