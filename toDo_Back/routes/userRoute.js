const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');




router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/addTask', AuthController.addTask);
router.get('/getTasks', AuthController.getTasks);
router.delete('/deleteTask/:id', AuthController.deleteTask);




module.exports = router;
