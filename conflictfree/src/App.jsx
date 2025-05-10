import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import QuillTextEditor from './containers/yquill'
import { Grid } from '@mui/material'
import CollaborativeEditor from './containers/yquill'
import HomePage from './containers/home'
import LoginPage from './containers/authentication/login'
import RegisterPage from './containers/authentication/register'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'

function App() {

  const username = localStorage.getItem('username')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={username? <HomePage/>: <LoginPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/editor/:docId" element={username? <CollaborativeEditor /> : <LoginPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
