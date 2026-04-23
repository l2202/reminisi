import { useNavigate } from "react-router-dom";

export default function AuthHome() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <h1>Bienvenido</h1>
      <p>Seleccione una opción</p>

      <button onClick={() => navigate("/login")}>
        Iniciar sesión
      </button>

      <button onClick={() => navigate("/register")}>
        Crear cuenta
      </button>
    </div>
  );
}