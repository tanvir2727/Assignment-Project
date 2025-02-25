const express = require('express');
const { signup, signin, getProfile,getAllUsers,logoutUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', authenticate  , getProfile);
router.get('/users',authenticate ,getAllUsers);
router.post("/logout",authenticate, logoutUser);


module.exports = router;
