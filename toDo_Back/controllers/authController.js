const db = require('../model/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const jwtSecret = process.env.JWT_SECRET;

class AuthController {
  // Signup Middleware
 static async signup(req, res, next) {
  const { email, userName, password } = req.body;

  if (!email || !userName || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user
    const newUser = new User({ email, userName, password: hashedPassword });
    await newUser.save();

    const newUserId = newUser._id.toString();

    // Create folder on disk
    const userFolderPath = path.join(__dirname, '..', 'uploads', newUserId);
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    // Save initial folder record
    const newFolder = new FolderInfo({
      folder_name: newUserId,
      parent_id: "0",
      user_id: newUserId
    });
    await newFolder.save();

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

  // Login Middleware
 
static async login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Unable to log in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect email or password' });
    }

    const userId = user._id.toString();

    // Find root folder
    const folder = await FolderInfo.findOne({
      user_id: userId,
      parent_id: "0",
      folder_name: userId
    });

    if (!folder) {
      return res.status(400).json({ success: false, message: 'Unable to log in' });
    }

    req.user = user;
    req.user.folder = folder;

    const token = jwt.sign(
      {
        id: userId,
        email: user.email,
        password: user.password,
        folder_id: folder._id.toString()
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

  static async verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing or malformed' });
    }

    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        });
      });

      req.user = decoded;

      next();
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }





  static logout(req, res) {
    // Invalidate the token on the client side by removing it from local storage
    // No server-side action needed for JWT
    res.json({ success: true, message: 'Logout successful' });
  }

  static async getUser(req, res) {
    const userId = req.user.id;

    try {
      const query = 'SELECT * FROM user WHERE id = ?';
      const [results] = await db.query(query, [userId]);

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const user = results[0];
      delete user.password; // Clean sensitive data

      return res.json({ success: true, user });
    } catch (err) {
      console.error('Error retrieving user:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve user' });
    }
  }


}

module.exports = AuthController;
