import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
    <div>
      <h1>Reminisi</h1>
    </div>
      <button onClick={() => navigate("/MenuJuegos")}>Juegos</button>
      <button onClick={() => navigate("/InfoPersonal")}>Mis datos</button>
      {/* boton provicional para indicar la ruta de la pantalla de autenticacion, se retirara una vez que las base de datos y la conexion sean funcinales */}
      <button onClick={() => navigate("/auth")}>Autenticar</button>
    </>
  );
}