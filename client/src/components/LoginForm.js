import React, { useState, useContext } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthContext from './AuthContext';


export const LoginForm = () => {
  const { setBearer } = useContext(AuthContext);
  const navigate = useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) { 
        toast.error("Error al iniciar sesión")
        throw new Error('Error de autenticación');
       
      } else {
        toast.success('Inicio de sesión exitoso. Bienvenido! ')
        const data = await response.json();
        setBearer(data);
        navigate('/tickers')
      }

    } catch (error) {
      console.error(error);
      setErrorMessage('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <div className='container'>
      <div className='form'>
        <h1>Ingresa los datos de tu cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Usuario</label>
            <input
              type='text'
              placeholder='Ingresar usuario...'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            <label>Contraseña</label>
            <input
              type='password'
              placeholder='Ingresar contraseña...'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type='submit' className='button'>Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
};
