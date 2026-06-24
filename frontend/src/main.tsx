import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import './index.css'

const theme = createTheme({
  palette: {
    primary: { main: '#1B4332', light: '#52B788', dark: '#0D2B1F' },
    secondary: { main: '#D4A017', light: '#E8C04D', dark: '#A07A10' },
    background: { default: '#F0F7F4', paper: '#FFFFFF' },
    success: { main: '#52B788' },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Nunito", sans-serif', fontWeight: 900 },
    h2: { fontFamily: '"Nunito", sans-serif', fontWeight: 800 },
    h3: { fontFamily: '"Nunito", sans-serif', fontWeight: 800 },
    h4: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: '1rem' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #0D2B1F 0%, #1B4332 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20, boxShadow: '0 4px 24px rgba(27,67,50,0.08)' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
