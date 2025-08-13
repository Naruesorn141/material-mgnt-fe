import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{ background: 'linear-gradient(to right, #4e54c8, #8f94fb)' }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ระบบจัดการวัสดุอุปกรณ์
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/materials"
          sx={{ textTransform: 'none', mx: 1 }}
        >
          วัสดุ
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/projects"
          sx={{ textTransform: 'none', mx: 1 }}
        >
          โปรเจค
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/transactions"
          sx={{ textTransform: 'none', mx: 1 }}
        >
          ธุรกรรม
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/reports"
          sx={{ textTransform: 'none', mx: 1 }}
        >
          รายงาน
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;