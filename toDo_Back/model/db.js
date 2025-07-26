const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/todo_app';

mongoose.connect(MONGO_URI);

module.exports = mongoose;
