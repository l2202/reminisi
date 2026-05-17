import { useNavigate } from "react-router-dom";
import "../styles/menujuegos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPuzzlePiece,
  faEquals,
  faTableCellsLarge,
  faCubesStacked,
  faArrowDownAZ,
  faUserSecret
} from "@fortawesome/free-solid-svg-icons";
import GameHeader from "../components/GameHeader";
export default function MenuJuegos() {
  const navigate = useNavigate();

  return (
    <div className="menu-juegos-container">
      <GameHeader title="Juegos" />

      <div className="juegos-grid">
        <button
          className="juego-card rosa"
          onClick={() => navigate("/memorama")}
        >
          <span>
            <FontAwesomeIcon icon={faPuzzlePiece} />
          </span>
          Memorama
        </button>

        <button
          className="juego-card morado"
          onClick={() => navigate("/operaciones")}
        >
          <span>
            <FontAwesomeIcon icon={faEquals} />
          </span>
          Operaciones
        </button>

        <button
          className="juego-card verde-esmeralda"
          onClick={() => navigate("/sudoku")}
        >
          <span>
            <FontAwesomeIcon icon={faTableCellsLarge} />
          </span>
          Sudoku
        </button>

        <button
          className="juego-card naranja"
          onClick={() => navigate("/patrones")}
        >
          <span>
            <FontAwesomeIcon icon={faCubesStacked} />
          </span>
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
          <span><FontAwesomeIcon icon={faArrowDownAZ} /></span>
          Sopa de letras
        </button>

        {
          <button
            className="juego-card morado"
            onClick={() => navigate("/Logica")}
          >
            <span><FontAwesomeIcon icon={faUserSecret} /></span>
            Lógica
          </button>
        }
      </div>
    </div>
  );
}
