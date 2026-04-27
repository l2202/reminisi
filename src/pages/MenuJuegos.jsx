import { useNavigate } from "react-router-dom";

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

      <button onClick={() => navigate("/memorama")}>
        Memorama
      </button>

      <button onClick={() => navigate("/operaciones")}>
        Operaciones
      </button>

      <button onClick={() => navigate("/sudoku")}>
        Sudoku
      </button>

      <button onClick={() => navigate("/patrones")}>
        Patrones
      </button>

      <button onClick={() => navigate("/figuras")}>
        Figuras
      </button>

      <button onClick={() => navigate("/sopaLetras")}>
        Sopa de letras
      </button>

      <button onClick={() => navigate("/Logica")}>
        Logica
      </button>
      
    </div>
  );
}