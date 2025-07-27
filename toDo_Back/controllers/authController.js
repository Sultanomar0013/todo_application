const db = require('../model/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../model/userModel');
const Task = require('../model/addTaskModel');

const jwtSecret = process.env.JWT_SECRET;

class AuthController {

  static async signup(req, res, next) {
    const { email, userName, password } = req.body;

    // console.log('Signup request received:', email);

    if (!email || !userName || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Save user
      const newUser = new User({ email, userName, password: hashedPassword });
      await newUser.save();

      const newUserId = newUser._id.toString();

      req.user = {
        id: newUserId,
        email,
        userName
      };

      next();
    } catch (err) {
      console.error('Signup error:', err);
      return res.status(500).json({ success: false, message: 'Signup failed' });
    }
  }



  static async login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Unable to log in' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect email or password' });
      }

      const userId = user._id.toString();


      req.user = user;

      const token = jwt.sign(
        {
          id: userId,
          email: user.email,
          password: user.password,
        },
        jwtSecret,
        { expiresIn: "7h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: "Logged in successfully",
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ success: false, message: "Login failed" });
    }
  }

  static async addTask(req, res) {
    const { title, description, dueDate, status, priority } = req.body;
    const token = req.cookies.token;
    console.log("Add Task Request:", req.body);
    console.log("Token:", token);

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      console.log('Adding task for user:', user_id);

      if (!title || !description || !dueDate || !status || !priority) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const newTask = new Task({
        title,
        description,
        dueDate,
        status,
        priority,
        userId: user_id,
      });

      await newTask.save();

      return res.json({ success: true, message: 'Task added successfully' });
    } catch (err) {
      console.error('Add task error:', err);
      return res.status(500).json({ success: false, message: 'Failed to add task' });
    }
  }

  static async getTasks(req, res) {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      // console.log('Fetching tasks for user:', user_id);

      const tasks = await Task.find({ userId: user_id });

      return res.json({ success: true, tasks });
    } catch (err) {
      console.error('Get tasks error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve tasks' });
    }
  }

  static async deleteTask(req, res) {
    const { id } = req.params;
    const token = req.cookies.token;
    console.log("Delete Task Request ID:", id);

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      console.log('Deleting task:', id, 'for user:', user_id);

      const task = await Task.findOneAndDelete({ _id: id, userId: user_id });

      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      return res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
      console.error('Delete task error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete task' });
    }
  }
}




module.exports = AuthController;
