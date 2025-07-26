import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [showSignUp, setShowSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_ADRESS;

    const handleSignUp = async () => {
        setLoading(true);
        setError('');

        if (!userName || !email || !password) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}user/signup`, {
                email,
                userName,
                password,
            });

            const data = response.data;

            if (data.success) {
                console.log('Sign-up successful:', data);
                setShowSignUp(false);
            } else {
                setError(data.message || 'Sign-up failed. Please try again.');
            }
        } catch (err) {
            console.error('Sign-up error:', err);
            setError('Error during sign-up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // const handleLogin = async () => {
    //     setLoading(true);
    //     setError('');

    //     try {
    //         const response = await axios.post(`${backendUrl}user/login`, {
    //             email,
    //             password,
    //         });

    //         const data = response.data;

    //         if (data.success) {
    //             console.log('Login successful:', data);
    //             localStorage.setItem('token', data.token);
    //             navigate('/docMod/home');
    //         } else {
    //             setError(data.message || 'Login failed. Please try again.');
    //         }
    //     } catch (err) {
    //         console.error('Login error:', err);
    //         setError('Error during login. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${backendUrl}user/login`, {
                email,
                password,
            }, {
                withCredentials: true
            });

            const data = response.data;

            if (data.success) {
                console.log('Login successful:', data);
                navigate('/docMod/home');
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Error during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', padding: '20px' }}>
            <Grid item xs={12} sm={8} md={4}>
                <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {error && <Typography color="error">{error}</Typography>}
                    <Typography variant="h5" align="center">
                        {showSignUp ? 'Sign Up' : 'Log In'}
                    </Typography>
                    <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                        {showSignUp && (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="User Name"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                            </>
                        )}
                        {!showSignUp && (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={showSignUp ? handleSignUp : handleLogin}
                                disabled={loading}
                                fullWidth
                            >
                                {loading
                                    ? (showSignUp ? 'Signing Up...' : 'Logging In...')
                                    : (showSignUp ? 'Sign Up' : 'Log In')}
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                color="secondary"
                                onClick={() => setShowSignUp(!showSignUp)}
                                fullWidth
                            >
                                {showSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default LogIn;
