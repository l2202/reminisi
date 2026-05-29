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

import sonidoSelect from "../assets/audio/select.mp3"
import GameHeader from "../components/GameHeader";
export default function MenuJuegos() {
  const audioSelect = new Audio(sonidoSelect);
  function navegarConSolido(ruta){
    audioSelect.play();
    setTimeout(() => {
      navigate(ruta);
    }, 120);
  }

  const navigate = useNavigate();

  return (
    <div className="menu-juegos-container">
      <GameHeader title="Juegos" />

      <div className="juegos-grid">
        <button
          className="juego-card rosa"
          onClick={() => navegarConSolido("/memorama")}
        >
          <span>
            <FontAwesomeIcon icon={faPuzzlePiece} />
          </span>
          Memorama
        </button>

        <button
          className="juego-card morado"
          onClick={() => navegarConSolido("/operaciones")}
        >
          <span>
            <FontAwesomeIcon icon={faEquals} />
          </span>
          Operaciones
        </button>

        <button
          className="juego-card verde-esmeralda"
          onClick={() => navegarConSolido("/sudoku")}
        >
          <span>
            <FontAwesomeIcon icon={faTableCellsLarge} />
          </span>
          Sudoku
        </button>

        <button
          className="juego-card naranja"
          onClick={() => navegarConSolido("/patrones")}
        >
          <span>
            <FontAwesomeIcon icon={faCubesStacked} />
          </span>
          Patrones
        </button>

        <button
          className="juego-card morado"
          onClick={() => navegarConSolido("/sopaLetras")}
        >
          <span><FontAwesomeIcon icon={faArrowDownAZ} /></span>
          Sopa de letras
        </button>

        {
          <button
            className="juego-card verde-esmeralda"
            onClick={() => navegarConSolido("/Logica")}
          >
            <span><FontAwesomeIcon icon={faUserSecret} /></span>
            Emoji Intruso
          </button>
        }
      </div>
    </div>
  );
}
