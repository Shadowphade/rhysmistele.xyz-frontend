//import { useState } from 'react'
import { Outlet } from 'react-router'
import './App.css'
import Navbar from './components/navbar'
import Background from './components/background'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {

  return (
    <>
        <ThemeProvider theme={darkTheme}>
          <Navbar />
          <Outlet />
          <Background />
        </ThemeProvider>
    </>
  )
}

export default App
