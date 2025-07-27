import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const backendUrl = import.meta.env.VITE_ADRESS;



  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${backendUrl}user/getTasks`, { withCredentials: true });
        console.log("Task Response:", res.data);
        setTasks(res.data.tasks);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };

    fetchTasks();
  }, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}user/deleteTask/${id}`, { withCredentials: true });
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };


  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Typography variant="h6" align="center" sx={{ my: 2 }}>
        Tasks List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task._id}>

                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDelete(task._id)}
                    style={{ marginLeft: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TasksTable;
