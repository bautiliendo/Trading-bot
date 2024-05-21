import { toast } from "react-hot-toast";

export const handleLogin = async (
  username,
  password,
  setBearer,
  navigate,
  setErrorMessage
) => {
  try {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      toast.error("Error al iniciar sesión");
      throw new Error("Error de autenticación");
    }

    const data = await response.json();
    setBearer(data);
    localStorage.setItem("credentials", JSON.stringify({ username, password }));
    toast.success("Inicio de sesión exitoso. Bienvenido! ");
    navigate("/tickers");
  } catch (error) {
    console.error(error);
    setErrorMessage(
      "Error al iniciar sesión. Por favor, verifica tus credenciales."
    );
  }
};
