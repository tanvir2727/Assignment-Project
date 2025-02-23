const express = require('express');
const { signup, signin, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', authenticate  , getProfile);

module.exports = router;
