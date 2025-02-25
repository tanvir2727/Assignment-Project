const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../middleware/authMiddleware');
const { findUserByEmail, createUser ,getUserById } = require('../model/userModel');
const db = require('../confige/db');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });

        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(name, email, hashedPassword);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const signin = async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

      const user = await findUserByEmail(email);
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
          httpOnly: true, // Prevents client-side JavaScript access
          secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        //   sameSite: 'Strict', // Prevents CSRF attacks
          sameSite: "None", // Allows cross-origin requests
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({ message: 'Login successful', accessToken });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};


const getProfile = async (req, res) => {
  try {
      const userId = req.user.id; // The user ID is available after token verification

      const user = await getUserById(userId); // Fetch user
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user); // Send the user profile data
  } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await db.promise().query('SELECT id, name, email FROM users');
        
        // If no users are found
        if (users[0].length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        
        res.status(200).json(users[0]); // Send the list of users
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};





module.exports = { signup, signin, getProfile,getAllUsers,logoutUser };
