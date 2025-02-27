import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
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
      toast.success("Sign Up Successfully");
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Server error');
    }
    
    navigate('/signin');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Sign Up</h2>

      {message && <p className="text-green-600 text-center mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>
      </form>
      
    </div>
    {/* <ToastContainer /> */}
  </div>
  );
};

export default SignUp;
