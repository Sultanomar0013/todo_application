const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/todo_app';

mongoose.connect(MONGO_URI);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected to todo_app');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
