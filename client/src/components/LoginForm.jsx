import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../helpers/loginHelper";
import '../assets/login.css';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { setBearer } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Verificar si hay credenciales guardadas en el LocalStorage
    const storedCredentials = localStorage.getItem("credentials");
    if (storedCredentials) {
      const { username: storedUsername, password: storedPassword } =
        JSON.parse(storedCredentials);
      setUsername(storedUsername);
      setPassword(storedPassword);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleLogin(username, password, setBearer, navigate, setErrorMessage);
  };

  return (
    <div className="container">
      <div className="form">
        <h1>Ingresa tus datos de acceso a la API Invertir online</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userName">Usuario</label>
            <input
              id="userName"
              type="text"
              placeholder="Ingresar usuario..."
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="userPass">Contraseña</label>
            <input
              id="userPass"
              type="password"
              placeholder="Ingresar contraseña..."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="button">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};
