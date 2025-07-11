import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openReceiveDialog, setOpenReceiveDialog] = useState(false);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL
  
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    description: '',
    unit: '',
    unitPrice: 0
  });
  
  const [transactionData, setTransactionData] = useState({
    materialId: '',
    projectId: '',
    quantity: 0,
    notes: ''
  });

  useEffect(() => {
    fetchMaterials();
    fetchProjects();
  }, []);

  const fetchMaterials = async () => {
    const response = await axios.get(`${backendUrl}/api/materials`);
    setMaterials(response.data);
  };

  const fetchProjects = async () => {
    const response = await axios.get(`${backendUrl}/api/projects`);
    setProjects(response.data);
  };

  const handleAddMaterial = async () => {
    await axios.post(`${backendUrl}/api/materials`, newMaterial);
    setOpenAddDialog(false);
    setNewMaterial({ name: '', description: '', unit: '', unitPrice: 0 });
    fetchMaterials();
  };

  const handleReceiveMaterial = async () => {
    await axios.post(`${backendUrl}/api/materials/receive`, {
      materialId: selectedMaterial.id,
      quantity: transactionData.quantity,
      notes: transactionData.notes
    });
    setOpenReceiveDialog(false);
    setTransactionData({ materialId: '', projectId: '', quantity: 0, notes: '' });
    fetchMaterials();
  };

  const handleWithdrawMaterial = async () => {
    await axios.post(`${backendUrl}/api/materials/withdraw`, {
      materialId: selectedMaterial.id,
      projectId: transactionData.projectId,
      quantity: transactionData.quantity,
      notes: transactionData.notes
    });
    setOpenWithdrawDialog(false);
    setTransactionData({ materialId: '', projectId: '', quantity: 0, notes: '' });
    fetchMaterials();
  };

  const handleReturnMaterial = async () => {
    await axios.post(`${backendUrl}/api/materials/return`, {
      materialId: selectedMaterial.id,
      projectId: transactionData.projectId,
      quantity: transactionData.quantity,
      notes: transactionData.notes
    });
    setOpenReturnDialog(false);
    setTransactionData({ materialId: '', projectId: '', quantity: 0, notes: '' });
    fetchMaterials();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">วัสดุอุปกรณ์</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpenAddDialog(true)}
        >
          เพิ่มวัสดุใหม่
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อ</TableCell>
              <TableCell>รายละเอียด</TableCell>
              <TableCell>หน่วย</TableCell>
              <TableCell>ราคาต่อหน่วย</TableCell>
              <TableCell>คงเหลือ</TableCell>
              <TableCell>การดำเนินการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.name}</TableCell>
                <TableCell>{material.description}</TableCell>
                <TableCell>{material.unit}</TableCell>
                <TableCell>{material.unitPrice}</TableCell>
                <TableCell>{material.stock}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    color="success"
                    onClick={() => {
                      setSelectedMaterial(material);
                      setTransactionData({...transactionData, materialId: material.id});
                      setOpenReceiveDialog(true);
                    }}
                  >
                    รับเข้า
                  </Button>
                  <Button 
                    size="small" 
                    color="warning"
                    onClick={() => {
                      setSelectedMaterial(material);
                      setTransactionData({...transactionData, materialId: material.id});
                      setOpenWithdrawDialog(true);
                    }}
                  >
                    เบิก
                  </Button>
                  <Button 
                    size="small" 
                    color="info"
                    onClick={() => {
                      setSelectedMaterial(material);
                      setTransactionData({...transactionData, materialId: material.id});
                      setOpenReturnDialog(true);
                    }}
                  >
                    คืน
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Material Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>เพิ่มวัสดุใหม่</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ชื่อ"
            fullWidth
            value={newMaterial.name}
            onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="รายละเอียด"
            fullWidth
            value={newMaterial.description}
            onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
          />
          <TextField
            margin="dense"
            label="หน่วย"
            fullWidth
            value={newMaterial.unit}
            onChange={(e) => setNewMaterial({...newMaterial, unit: e.target.value})}
          />
          <TextField
            margin="dense"
            label="ราคาต่อหน่วย"
            type="number"
            fullWidth
            value={newMaterial.unitPrice}
            onChange={(e) => setNewMaterial({...newMaterial, unitPrice: parseFloat(e.target.value)})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleAddMaterial} color="primary">บันทึก</Button>
        </DialogActions>
      </Dialog>

      {/* Receive Material Dialog */}
      <Dialog open={openReceiveDialog} onClose={() => setOpenReceiveDialog(false)}>
        <DialogTitle>รับวัสดุเข้า: {selectedMaterial?.name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="จำนวน"
            type="number"
            fullWidth
            value={transactionData.quantity}
            onChange={(e) => setTransactionData({...transactionData, quantity: parseInt(e.target.value)})}
          />
          <TextField
            margin="dense"
            label="หมายเหตุ"
            fullWidth
            value={transactionData.notes}
            onChange={(e) => setTransactionData({...transactionData, notes: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReceiveDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleReceiveMaterial} color="primary">บันทึก</Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Material Dialog */}
      <Dialog open={openWithdrawDialog} onClose={() => setOpenWithdrawDialog(false)}>
        <DialogTitle>เบิกวัสดุ: {selectedMaterial?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>โปรเจค</InputLabel>
            <Select
              value={transactionData.projectId}
              onChange={(e) => setTransactionData({...transactionData, projectId: parseInt(e.target.value)})}
            >
              {projects.map(project => (
                <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="จำนวน"
            type="number"
            fullWidth
            value={transactionData.quantity}
            onChange={(e) => setTransactionData({...transactionData, quantity: parseInt(e.target.value)})}
          />
          <TextField
            margin="dense"
            label="หมายเหตุ"
            fullWidth
            value={transactionData.notes}
            onChange={(e) => setTransactionData({...transactionData, notes: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWithdrawDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleWithdrawMaterial} color="primary">บันทึก</Button>
        </DialogActions>
      </Dialog>

      {/* Return Material Dialog */}
      <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)}>
        <DialogTitle>คืนวัสดุ: {selectedMaterial?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>โปรเจค</InputLabel>
            <Select
              value={transactionData.projectId}
              onChange={(e) => setTransactionData({...transactionData, projectId: parseInt(e.target.value)})}
            >
              {projects.map(project => (
                <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="จำนวน"
            type="number"
            fullWidth
            value={transactionData.quantity}
            onChange={(e) => setTransactionData({...transactionData, quantity: parseInt(e.target.value)})}
          />
          <TextField
            margin="dense"
            label="หมายเหตุ"
            fullWidth
            value={transactionData.notes}
            onChange={(e) => setTransactionData({...transactionData, notes: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReturnDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleReturnMaterial} color="primary">บันทึก</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaterialsPage;