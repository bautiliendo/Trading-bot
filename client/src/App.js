import React from 'react'
import { LoginForm } from './components/LoginForm';
import { Routes, Route } from "react-router-dom"
import { Tickers } from './components/Tickers';
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './components/AuthContext';
import { Table } from './components/Table';

function App() {
  return (
    <AuthProvider>
  <Toaster  toastOptions={{duration: 2000}} />
   <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/tickers" element={<Tickers />} />
      <Route path="/table" element={<Table />} />
  </Routes>
    </AuthProvider>
  )
}

export default App;
