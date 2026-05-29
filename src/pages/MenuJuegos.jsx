import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/menujuegos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPuzzlePiece,
  faEquals,
  faTableCellsLarge,
  faCubesStacked,
  faArrowDownAZ,
  faUserSecret,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import sonidoSelect from "../assets/audio/select.mp3"
import GameHeader from "../components/GameHeader";
import {
  selectFavoriteGames,
  toggleFavoriteGame,
} from "../reducers/favoriteGamesSlice";

const games = [
  {
    id: "memorama",
    name: "Memorama",
    route: "/memorama",
    colorClass: "rosa",
    icon: faPuzzlePiece,
  },
  {
    id: "operaciones",
    name: "Operaciones",
    route: "/operaciones",
    colorClass: "morado",
    icon: faEquals,
  },
  {
    id: "sudoku",
    name: "Sudoku",
    route: "/sudoku",
    colorClass: "verde-esmeralda",
    icon: faTableCellsLarge,
  },
  {
    id: "patrones",
    name: "Patrones",
    route: "/patrones",
    colorClass: "naranja",
    icon: faCubesStacked,
  },
  {
    id: "sopa-letras",
    name: "Sopa de letras",
    route: "/sopaLetras",
    colorClass: "morado",
    icon: faArrowDownAZ,
  },
  {
    id: "logica",
    name: "Emoji Intruso",
    route: "/Logica",
    colorClass: "verde-esmeralda",
    icon: faUserSecret,
  },
];

export default function MenuJuegos() {
  const audioSelect = new Audio(sonidoSelect);
  const dispatch = useDispatch();
  const favoriteGames = useSelector(selectFavoriteGames);
  const favoriteGameIds = new Set(favoriteGames.map((game) => game.id));
  const hasFavoriteGames = favoriteGames.length > 0;
  const orderedGames = hasFavoriteGames
    ? [...games].sort((firstGame, secondGame) => {
        const firstIsFavorite = favoriteGameIds.has(firstGame.id);
        const secondIsFavorite = favoriteGameIds.has(secondGame.id);

        if (firstIsFavorite === secondIsFavorite) return 0;
        return firstIsFavorite ? -1 : 1;
      })
    : games;

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
        {orderedGames.map((game) => {
          const isFavorite = favoriteGameIds.has(game.id);

          return (
            <article
              className={`juego-card ${game.colorClass}`}
              key={game.id}
            >
              <button
                type="button"
                className={`favorite-game-btn ${isFavorite ? "active" : ""}`}
                onClick={() => dispatch(toggleFavoriteGame(game))}
                aria-label={
                  isFavorite
                    ? `Quitar ${game.name} de favoritos`
                    : `Marcar ${game.name} como favorito`
                }
                aria-pressed={isFavorite}
                title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <FontAwesomeIcon icon={faStar} />
              </button>

              <button
                type="button"
                className="juego-card-content"
                onClick={() => navegarConSolido(game.route)}
              >
                <span>
                  <FontAwesomeIcon icon={game.icon} />
                </span>
                {game.name}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
