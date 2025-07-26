// server/index.js
require('dotenv').config();
require('./model/db');


const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoute');
const cookieParser = require('cookie-parser');





app.use(express.json());
app.use(cookieParser());
dotenv.config();


app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.options('*', cors());

dotenv.config();

const server = http.createServer(app);

app.use('/user', userRoutes);





app.get('/', (req, res) => {
  res.send('Hello, world! Your server is working!');
});

server.listen(process.env.PORT || 5000, () => {
  console.log('listening on *:5000');
});