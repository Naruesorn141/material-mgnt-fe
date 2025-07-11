import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await axios.get(`${backendUrl}/api/projects`);
    setProjects(response.data);
  };

  const handleAddProject = async () => {
    await axios.post(`${backendUrl}/api/projects`, newProject);
    setOpenDialog(false);
    setNewProject({ name: '', description: '' });
    fetchProjects();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">โปรเจค</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          เพิ่มโปรเจคใหม่
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อ</TableCell>
              <TableCell>รายละเอียด</TableCell>
              <TableCell>วันที่สร้าง</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>เพิ่มโปรเจคใหม่</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ชื่อ"
            fullWidth
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="รายละเอียด"
            fullWidth
            value={newProject.description}
            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleAddProject} color="primary">บันทึก</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectsPage;