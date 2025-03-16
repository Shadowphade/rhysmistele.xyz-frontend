//import { useState } from 'react'
import { Outlet } from 'react-router'
import './App.css'
import Navbar from './components/navbar'

function App() {

  return (
    <>
        <Navbar />
        <Outlet />
    </>
  )
}

export default App
