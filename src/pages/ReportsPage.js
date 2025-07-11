import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, InputLabel, FormControl,
  Accordion, AccordionSummary, AccordionDetails,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const ReportsPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [report, setReport] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [expandedMaterial, setExpandedMaterial] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchReport = async (projectId) => {
    try {
      // Fetch summary report
      const reportResponse = await axios.get(`${backendUrl}/api/projects/${projectId}/report`);
      setReport(reportResponse.data);
      
      // Fetch detailed transactions
      const transactionsResponse = await axios.get(`${backendUrl}/api/transactions`, {
        params: { projectId }
      });
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    if (projectId) {
      fetchReport(projectId);
    }
  };

  const handleMaterialExpand = (materialId) => {
    setExpandedMaterial(expandedMaterial === materialId ? null : materialId);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    };
    return new Date(dateString).toLocaleString('th-TH', options);
  };

  const getTransactionType = (type) => {
    switch(type) {
      case 'RECEIVE': return 'รับเข้า';
      case 'WITHDRAW': return 'เบิก';
      case 'RETURN': return 'คืน';
      default: return type;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>รายงานการใช้วัสดุ</Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>เลือกโปรเจค</InputLabel>
        <Select
          value={selectedProject}
          onChange={handleProjectChange}
          label="เลือกโปรเจค"
        >
          {projects.map(project => (
            <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {report && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            รายงานโปรเจค: {report.project.name}
          </Typography>
          
          {/* Summary Table */}
          <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>วัสดุ</TableCell>
                  <TableCell>เบิกทั้งหมด</TableCell>
                  <TableCell>คืนทั้งหมด</TableCell>
                  <TableCell>ใช้จริง</TableCell>
                  <TableCell>ราคาต่อหน่วย</TableCell>
                  <TableCell>ต้นทุนรวม</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.materialUsage.map((item, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        <Accordion 
                          expanded={expandedMaterial === item.material.id}
                          onChange={() => handleMaterialExpand(item.material.id)}
                          elevation={0}
                          sx={{ backgroundColor: 'transparent' }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            {item.material.name} ({item.material.unit})
                          </AccordionSummary>
                        </Accordion>
                      </TableCell>
                      <TableCell>{item.totalWithdrawn}</TableCell>
                      <TableCell>{item.totalReturned}</TableCell>
                      <TableCell>{item.netUsage}</TableCell>
                      <TableCell>{item.material.unitPrice.toFixed(2)} บาท</TableCell>
                      <TableCell>{item.totalCost.toFixed(2)} บาท</TableCell>
                    </TableRow>
                    
                    {/* Transaction Details */}
                    {expandedMaterial === item.material.id && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ py: 0, borderBottom: 0 }}>
                          <AccordionDetails>
                            <Typography variant="subtitle2" gutterBottom>
                              รายละเอียดธุรกรรม
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>วันที่</TableCell>
                                  <TableCell>ประเภท</TableCell>
                                  <TableCell>จำนวน</TableCell>
                                  <TableCell>หมายเหตุ</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {transactions
                                  .filter(t => t.materialId === item.material.id)
                                  .map((transaction, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                                      <TableCell>{getTransactionType(transaction.type)}</TableCell>
                                      <TableCell>{transaction.quantity}</TableCell>
                                      <TableCell>{transaction.notes || '-'}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </AccordionDetails>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                <TableRow>
                  <TableCell colSpan={5} align="right"><strong>รวมต้นทุนทั้งหมด</strong></TableCell>
                  <TableCell><strong>{report.totalCost.toFixed(2)} บาท</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Full Transaction History */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>ประวัติธุรกรรมทั้งหมด</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>วันที่</TableCell>
                      <TableCell>วัสดุ</TableCell>
                      <TableCell>ประเภท</TableCell>
                      <TableCell>จำนวน</TableCell>
                      <TableCell>หมายเหตุ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                        <TableCell>
                          {transaction.material?.name} ({transaction.material?.unit})
                        </TableCell>
                        <TableCell>{getTransactionType(transaction.type)}</TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>{transaction.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default ReportsPage;