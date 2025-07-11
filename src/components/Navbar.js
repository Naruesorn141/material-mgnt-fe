import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ระบบจัดการวัสดุอุปกรณ์
        </Typography>
        <Button color="inherit" component={Link} to="/materials">
          วัสดุ
        </Button>
        <Button color="inherit" component={Link} to="/projects">
          โปรเจค
        </Button>
        <Button color="inherit" component={Link} to="/transactions">
          ธุรกรรม
        </Button>
        <Button color="inherit" component={Link} to="/reports">
          รายงาน
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;