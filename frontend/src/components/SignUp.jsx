import { useState } from 'react';
import axios from "../axios"; // Import your configured axios instance

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
