const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');


router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Backend App!' });
});

// Signup Route
router.post('/signup', AuthController.signup, (req, res) => {
  res.json({ success: true, message: 'Sign-in successful' });
});

// Login Route
router.post('/login', AuthController.login, (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    token: req.token, // 👉 get token from middleware
    user: req.user,   // optional: send user info too
  });
});

router.post('/auth', AuthController.verifyToken, (req, res) => {
  res.json({ success: true, message: 'Token is valid' });
});
router.get('/getUserId', AuthController.verifyToken, (req, res) => {
  res.json({ success: true, userId: req.user.id, folderId: req.user.folder_id });
});
// Logout Route
router.post('/logout', AuthController.logout, (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});


module.exports = router;
