import { useState } from 'react';
import axios from '../axios'; // Import your configured axios instance
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('All fields are required');
      return;
    }

    try {
      // Send POST request to backend to log in the user
      const response = await axios.post('/auth/signin', { email, password },{
        withCredentials: true,
      });

      // Save the access token to localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      setMessage('Login successful!');
      setEmail('');
      setPassword('');

    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Server error');
    }

    navigate('/profile');
  };

 


  return (
    <div>
      <h2>Sign In</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
