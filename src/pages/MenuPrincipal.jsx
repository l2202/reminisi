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
    </>
  );
}