import { render, screen } from '@testing-library/react';

// Mock react-router-dom to avoid pulling in the real implementation during tests
jest.mock(
  'react-router-dom',
  () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => element,
    Link: ({ children }) => <div>{children}</div>,
  }),
  { virtual: true },
);

// Stub out MUI components used by the application
jest.mock(
  '@mui/material',
  () => ({
    AppBar: ({ children }) => <div>{children}</div>,
    Toolbar: ({ children }) => <div>{children}</div>,
    Typography: ({ children }) => <div>{children}</div>,
    Button: ({ children }) => <button>{children}</button>,
    CssBaseline: ({ children }) => <div>{children}</div>,
    Container: ({ children }) => <div>{children}</div>,
    ThemeProvider: ({ children }) => <div>{children}</div>,
    createTheme: () => ({}),
  }),
  { virtual: true },
);

// Mock page components to avoid importing their heavy dependencies
jest.mock('./pages/MaterialsPage', () => () => <div>Materials</div>);
jest.mock('./pages/ProjectsPage', () => () => <div>Projects</div>);
jest.mock('./pages/TransactionsPage', () => () => <div>Transactions</div>);
jest.mock('./pages/ReportsPage', () => () => <div>Reports</div>);

// Import App after mocking react-router-dom
const App = require('./App').default;

test('renders application title', () => {
  render(<App />);
  const titleElement = screen.getByText(/ระบบจัดการวัสดุอุปกรณ์/i);
  expect(titleElement).toBeInTheDocument();
});
