import { useNavigate } from "react-router-dom";
import "../styles/menujuegos.css";

export default function MenuJuegos() {
  const navigate = useNavigate();

  return (
    <div className="menu-juegos-container">
      <div className="navigate-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Juegos</h1>
      </div>

      <div className="juegos-grid">
        <button
          className="juego-card rosa"
          onClick={() => navigate("/memorama")}
        >
          <span>🧠</span>
          Memorama
        </button>

        <button
          className="juego-card morado"
          onClick={() => navigate("/operaciones")}
        >
          <span>🧩</span>
          Operaciones
        </button>

        <button
          className="juego-card verde-esmeralda"
          onClick={() => navigate("/sudoku")}
        >
          <span>✨</span>
          Sudoku
        </button>

        <button
          className="juego-card naranja"
          onClick={() => navigate("/patrones")}
        >
          <span>📊</span>
          Patrones
        </button>

        {/* <button className="juego-card azul" onClick={() => navigate("/figuras")}>
          <span>🔷</span>
          Figuras
        </button> */}

        <button
          className="juego-card verde-esmeralda"
          onClick={() => navigate("/sopaLetras")}
        >
          <span>📝</span>
          Sopa de letras
        </button>

        {
          <button
            className="juego-card morado"
            onClick={() => navigate("/Logica")}
          >
            <span>💡</span>
            Lógica
          </button>
        }
      </div>
    </div>
  );
}
