import Router from './router'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '../lib/context/ThemeContext.tsx';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;
