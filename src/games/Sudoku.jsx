import React, { useState, useEffect } from "react";
import "../styles/sudoku.css";
import { useNavigate } from "react-router-dom";
import GameHeader from "../components/GameHeader";
import sonidoCorrecto from "../assets/audio/correcto_largo.wav";
import sonidoFallo from "../assets/audio/fallo_corto.mp3";
import sonidoReset from "../assets/audio/reset.mp3";
import sonidoSwap from "../assets/audio/swap.mp3";
const BASE_SOLUTIONS = [
  [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 3, 4, 1],
    [4, 1, 2, 3],
  ],
  [
    [2, 1, 4, 3],
    [4, 3, 2, 1],
    [1, 2, 3, 4],
    [3, 4, 1, 2],
  ],
];

const generarTableroUnico = () => {
  let randomBase =
    BASE_SOLUTIONS[Math.floor(Math.random() * BASE_SOLUTIONS.length)];
  let solucion = randomBase.map((row) => [...row]);

  // Mezclas aleatorias
  if (Math.random() > 0.5)
    [solucion[0], solucion[1]] = [solucion[1], solucion[0]];
  if (Math.random() > 0.5)
    [solucion[2], solucion[3]] = [solucion[3], solucion[2]];

  const swapColumns = (c1, c2) => {
    solucion.forEach((row) => {
      let temp = row[c1];
      row[c1] = row[c2];
      row[c2] = temp;
    });
  };
  if (Math.random() > 0.5) swapColumns(0, 1);
  if (Math.random() > 0.5) swapColumns(2, 3);

  const numeros = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
  return solucion.map((row) => row.map((val) => numeros[val - 1]));
};

const crearAcertijo = (solucion, dificultad) => {
  let visibles =
    dificultad === "Dificultad Baja"
      ? 10
      : dificultad === "Dificultad Media"
        ? 7
        : 4;
  let inicial = solucion.map((row) => row.map(() => ""));
  let posiciones = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) posiciones.push({ r, c });

  posiciones.sort(() => Math.random() - 0.5);
  for (let i = 0; i < visibles; i++) {
    const { r, c } = posiciones[i];
    inicial[r][c] = solucion[r][c];
  }
  return inicial;
};

const validarGrupo = (grupo) => {
  const numeros = [1, 2, 3, 4];

  return grupo.length === 4 && numeros.every((n) => grupo.includes(n));
};

const validarSudoku = (tablero) => {
  // FILAS

  for (let fila = 0; fila < 4; fila++) {
    if (!validarGrupo(tablero[fila])) {
      return false;
    }
  }

  // COLUMNAS

  for (let col = 0; col < 4; col++) {
    const columna = [];

    for (let fila = 0; fila < 4; fila++) {
      columna.push(tablero[fila][col]);
    }

    if (!validarGrupo(columna)) {
      return false;
    }
  }

  // VALIDAR 2x2

  for (let fila = 0; fila < 4; fila += 2) {
    for (let col = 0; col < 4; col += 2) {
      const bloque = [];

      for (let f = 0; f < 2; f++) {
        for (let c = 0; c < 2; c++) {
          bloque.push(tablero[fila + f][col + c]);
        }
      }

      if (!validarGrupo(bloque)) {
        return false;
      }
    }
  }

  return true;
};

export default function Sudoku() {
  const navigate = useNavigate();

  const [dificultad, setDificultad] = useState("Dificultad Baja");
  const [solucion, setSolucion] = useState([]);
  const [tableroInicial, setTableroInicial] = useState([]);
  const [tableroUsuario, setTableroUsuario] = useState([]);
  const [estado, setEstado] = useState("jugando"); // 'jugando', 'ganado', 'incorrecto'

  const audioCorrecto = new Audio(sonidoCorrecto);
  const audioFallo = new Audio(sonidoFallo);
  const audioReset = new Audio(sonidoReset);
  const audioSwap = new Audio(sonidoSwap);
  const iniciarJuego = (nivel = dificultad) => {
    const nuevaSol = generarTableroUnico();
    const nuevoAce = crearAcertijo(nuevaSol, nivel);
    setSolucion(nuevaSol);
    setTableroInicial(nuevoAce);
    setTableroUsuario(nuevoAce.map((row) => [...row]));
    setEstado("jugando");
  };

  useEffect(() => iniciarJuego(), []);

  const handleCeldaChange = (fila, col, valor) => {
    if (valor !== "" && !["1", "2", "3", "4"].includes(valor)) return;

    const nuevoTablero = tableroUsuario.map((r, fIdx) =>
      r.map((c, cIdx) =>
        fIdx === fila && cIdx === col
          ? valor === ""
            ? ""
            : parseInt(valor)
          : c,
      ),
    );
    setTableroUsuario(nuevoTablero);

    const estaLleno = nuevoTablero.every((row) =>
      row.every((celda) => celda !== ""),
    );

    if (estaLleno) {
      const esCorrecto = validarSudoku(nuevoTablero);
      if (esCorrecto) {
        audioCorrecto.play();
        setEstado("ganado");
      } else {
        audioFallo.play();
        setEstado("incorrecto");
      }
      //setEstado(esCorrecto ? "ganado" : "incorrecto");
    } else {
      setEstado("jugando");
    }
  };

  return (
    <div className="sudoku-container">
      <GameHeader title="Sudoku" />
      <div className="general-actions">
        <button
          className="reset-button"
          onClick={() => {
            audioReset.play();
            iniciarJuego();
          }}
        >
          Reiniciar
        </button>
      </div>
      <div className="sudoku-grid">
        {tableroUsuario.map((fila, fIdx) =>
          fila.map((celda, cIdx) => (
            <div
              key={`${fIdx}-${cIdx}`}
              className={`sudoku-cell 
              ${cIdx === 1 ? "cell-right-border" : ""} 
              ${fIdx === 1 ? "cell-bottom-border" : ""}`}
            >
              <input
                className={`sudoku-input 
                  ${tableroInicial[fIdx][cIdx] !== "" ? "fixed" : "user-digit"}`}
                type="text"
                inputMode="numeric"
                value={celda}
                disabled={tableroInicial[fIdx][cIdx] !== ""}
                onChange={(e) => handleCeldaChange(fIdx, cIdx, e.target.value)}
              />
            </div>
          )),
        )}
      </div>

      {estado === "ganado" && (
        <div className="status-message success">
          ¡Excelente! Todo es correcto.
        </div>
      )}

      {estado === "incorrecto" && (
        <div className="status-message error">
          Hay errores en el tablero. ¡Sigue intentando! ❌
        </div>
      )}
      <div className="memory-controls">
        <div className="difficulty-buttons">
          {["Dificultad Baja", "Dificultad Media", "Dificultad Alta"].map(
            (diff) => (
              <button
                key={diff}
                className={`difficulty-btn ${dificultad === diff ? "active" : ""}`}
                onClick={() => {
                  audioSwap.play();
                  setDificultad(diff);
                  iniciarJuego(diff);
                }}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
