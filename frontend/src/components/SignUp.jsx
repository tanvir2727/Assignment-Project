import { useState } from 'react';
import "./Singup.css"
import { useNavigate } from 'react-router-dom';
import axios from "../axios"; // Import your configured axios instance

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage('All fields are required');
      return;
    }

    try {
      // Send POST request to the backend to create the user
      const response = await axios.post('/auth/signup', { name, email, password });
      setMessage('User registered successfully!');
      setName('');
      setEmail('');
      setPassword('');
      console.log(response);
      
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Server error');
    }
    navigate('/signin');
  };

  return (
    <div className="container">
      <div className="signup-box">
        <h2>Sign Up</h2>

        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
