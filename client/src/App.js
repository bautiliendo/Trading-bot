import React from 'react'
import { LoginForm } from './components/LoginForm';
import { Routes, Route } from "react-router-dom"
import { Tickers } from './components/Tickers';
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
  <Toaster  toastOptions={{duration: 2000}} />
   <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/tickers" element={<Tickers />} />
  </Routes>
    </AuthProvider>
  )
}

export default App;
