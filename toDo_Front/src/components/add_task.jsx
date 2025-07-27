import { useState } from "react";
import Cookies from 'js-cookie';
import {
  Modal, Box, TextField, Button, MenuItem, Typography
} from "@mui/material";
import axios from "axios";

const style = {
  position: "absolute", top: "50%", left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400, bgcolor: "background.paper",
  boxShadow: 24, p: 4, borderRadius: 2,
};

export default function AddTask() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const backendUrl = import.meta.env.VITE_ADRESS;

  const [formData, setFormData] = useState({
    title: "", description: "", dueDate: "",
    status: "Pending", priority: "Low"
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const token = Cookies.get('token');
    console.log("Token:", token);
    console.log("Form Data:", formData);

    try {
      await axios.post(`${backendUrl}user/addTask`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleClose();
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="contained">Add</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>Add Task</Typography>

          <TextField fullWidth label="Title" name="title" onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Description" name="description" onChange={handleChange} margin="normal" />
          <TextField fullWidth type="date" name="dueDate" onChange={handleChange} margin="normal" />

          <TextField
            fullWidth select name="status" label="Status"
            value={formData.status} onChange={handleChange} margin="normal"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          <TextField
            fullWidth select name="priority" label="Priority"
            value={formData.priority} onChange={handleChange} margin="normal"
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>

          <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>Submit</Button>
        </Box>
      </Modal>
    </>
  );
}
