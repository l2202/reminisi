import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/sudoku.css"
const dificultades = {
  facil: 30,
  medio: 40,
  dificil: 50,
};

const tableroBase = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

function copiar(tablero) {
  return tablero.map((fila) => [...fila]);
}

function mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generarSudoku(vacios) {
  const solucion = copiar(tableroBase);
  const puzzle = copiar(tableroBase);

  let eliminados = 0;

  while (eliminados < vacios) {
    const fila = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[fila][col] !== "") {
      puzzle[fila][col] = "";
      eliminados++;
    }
  }

  return { puzzle, solucion };
}

export default function Sudoku() {
  const navigate = useNavigate();

  const [dificultad, setDificultad] = useState("facil");

  const [tablero, setTablero] = useState([]);

  const [solucion, setSolucion] = useState([]);

  const [mensaje, setMensaje] = useState("");

  const [errores, setErrores] = useState(0);

  function iniciarJuego() {
    const { puzzle, solucion } =
      generarSudoku(dificultades[dificultad]);

    setTablero(puzzle);

    setSolucion(solucion);

    setErrores(0);

    setMensaje("Completa el sudoku");
  }

  useEffect(() => {
    iniciarJuego();
  }, [dificultad]);

  function cambiarValor(fila, col, valor) {
    if (tablero[fila][col] !== "") return;

    if (!valor.match(/^[1-9]?$/)) return;

    const nuevo = copiar(tablero);

    nuevo[fila][col] = valor === "" ? "" : Number(valor);

    setTablero(nuevo);
  }

  function revisar() {
    let incorrectos = 0;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (
          tablero[i][j] !== "" &&
          tablero[i][j] !== solucion[i][j]
        ) {
          incorrectos++;
        }
      }
    }

    if (incorrectos === 0) {
      const completo = tablero.every((fila) =>
        fila.every((c) => c !== "")
      );

      if (completo) {
        setMensaje("¡Sudoku completado! ✅");
      } else {
        setMensaje("Vas bien 👍");
      }
    } else {
      setErrores(incorrectos);
      setMensaje(`Hay ${incorrectos} errores ❌`);
    }
  }

  return (
    <div className="sudoku-game page">

      <div className="navigate-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <h1>Sudoku</h1>
      </div>

      <div className="sudoku-top card">

        <div>
          <p className="memory-kicker">
            Selecciona dificultad
          </p>

          <h2>Completa el tablero</h2>
        </div>

        <div className="difficulty-buttons">
          {Object.keys(dificultades).map((d) => (
            <button
              key={d}
              className={`difficulty-btn ${
                dificultad === d ? "active" : ""
              }`}
              onClick={() => setDificultad(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="memory-status">
        <div>
          <span>Errores</span>
          <strong>{errores}</strong>
        </div>

        <div>
          <span>Dificultad</span>
          <strong>{dificultad}</strong>
        </div>
      </div>

      <p className="memory-message">
        {mensaje}
      </p>

      <div className="sudoku-board">
        {tablero.map((fila, i) =>
          fila.map((celda, j) => {

            const editable =
              tableroBase[i][j] !== celda;

            return (
              <input
                key={`${i}-${j}`}
                type="text"
                maxLength={1}
                value={celda}
                disabled={!editable && celda !== ""}
                className={`sudoku-cell ${
                  !editable && celda !== ""
                    ? "fixed"
                    : ""
                }`}
                onChange={(e) =>
                  cambiarValor(i, j, e.target.value)
                }
              />
            );
          })
        )}
      </div>

      <div className="memory-actions">

        <button
          className="memory-secondary"
          onClick={revisar}
        >
          Revisar
        </button>

        <button
          className="memory-secondary"
          onClick={iniciarJuego}
        >
          Nuevo
        </button>

      </div>
    </div>
  );
}