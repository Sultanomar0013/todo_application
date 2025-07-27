import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LogIn from './pages/login';
import Home from './pages/home';
import './App.css';


function App() {
    return (
        <Router>


            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/home" element={<Home />} />
            </Routes>

        </Router>
    );
}

export default App;
