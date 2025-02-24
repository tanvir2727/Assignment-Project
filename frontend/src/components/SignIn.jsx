import { useState } from 'react';
import "./SignInPage.css"
import axios from '../axios'; // Import your configured axios instance
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('All fields are required');
      return;
    }

    try {
      // Send POST request to backend to log in the user
      const response = await axios.post('/auth/signin', { email, password },{
        withCredentials: true,
      });

      // Save the access token to localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      toast.success("Log In Successfully");
      // setMessage('Login successful!');
      setEmail('');
      setPassword('');

    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Server error');
    }

    navigate('/profile');
  };

 


  return (
    <div className="signin-container">
    <div className="signin-form">
      <h2 className="signin-title">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="submit-button" onClick={() => toast.success('Signed in successfully!')}>Sign In</button>
      </form>
    </div>

    {/* Toast Container for notifications */}
    <ToastContainer />
  </div>
  );
};

export default SignIn;
