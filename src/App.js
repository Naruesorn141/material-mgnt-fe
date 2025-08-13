import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import MaterialsPage from './pages/MaterialsPage';
import ProjectsPage from './pages/ProjectsPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4e54c8',
    },
    secondary: {
      main: '#8f94fb',
    },
  },
  typography: {
    fontFamily: 'Prompt, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<MaterialsPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;