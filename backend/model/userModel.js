const bcrypt = require('bcryptjs');
const db = require('../confige/db');
const mysql = require('mysql2/promise');


const createUser = (name, email, password, callback) => {
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], callback);
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0 ? results[0] : null);
    });
  });
};

const getUserById = async (userId) => {
  try {
    // Use process.env to fetch values from the .env file
    const connection = await mysql.createConnection({ 
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,  // Make sure password is included
      database: process.env.DB_NAME
    });

    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
    await connection.end(); // Close the connection
    return rows[0]; // Return the first row (user)
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error; // Rethrow the error for handling in the controller
  }
};
module.exports = { findUserByEmail, createUser,getUserById };
