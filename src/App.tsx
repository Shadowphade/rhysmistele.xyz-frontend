//import { useState } from 'react'
import { Outlet } from 'react-router'
import './App.css'
import Navbar from './components/navbar'
import Background from './components/background'

function App() {

  return (
    <>
        <Background />
        <Navbar />
        <Outlet />
    </>
  )
}

export default App
