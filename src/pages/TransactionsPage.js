import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import axios from 'axios';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const response = await axios.get(`${backendUrl}/api/transactions`);
    setTransactions(response.data);
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
      <Typography variant="h4" gutterBottom>ประวัติธุรกรรม</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>วัสดุ</TableCell>
              <TableCell>โปรเจค</TableCell>
              <TableCell>ประเภท</TableCell>
              <TableCell>จำนวน</TableCell>
              <TableCell>วันที่</TableCell>
              <TableCell>หมายเหตุ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.material?.name}</TableCell>
                <TableCell>{transaction.project?.name || '-'}</TableCell>
                <TableCell>{getTransactionType(transaction.type)}</TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                <TableCell>{transaction.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionsPage;