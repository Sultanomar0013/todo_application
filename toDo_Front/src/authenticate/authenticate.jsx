import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Authenticate({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const backendUrl = import.meta.env.VITE_ADRESS;

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${backendUrl}user/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!data.success) {
          localStorage.removeItem('token'); // Optional: clear bad token
          navigate('/'); // Redirect to login
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error verifying token:', err);
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    verifyToken();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}

export default Authenticate;
