import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/memorama.css";
import GameHeader from "../components/GameHeader";
import sonidoSeleccionar from "../assets/audio/select2.mp3";
import sonidoCorrecto from "../assets/audio/correcto_corto.mp3";
import sonidoFallo from "../assets/audio/fallo_corto.mp3";
import sonidoTictac from "../assets/audio/tictac.mp3";
import sonidoReset from "../assets/audio/reset.mp3";
import sonidoCorrectoLargo from "../assets/audio/correcto_largo.wav";
import sonidoSwap from "../assets/audio/swap.mp3";

const EMOJIS_BASE = [
  "🌞",
  "🌙",
  "⭐",
  "🌈",
  "🌻",
  "🍎",
  "🍓",
  "🍋",
  "🐶",
  "🐱",
  "🐦",
  "🐢",
  "🚗",
  "🏠",
  "🎵",
  "❤️",
];

const DIFICULTADES = {
  4: { nombre: "Dificultad Baja", columnas: 4 },
  6: { nombre: "Dificultad Media", columnas: 4 },
  8: { nombre: "Dificultad Alta", columnas: 4 },
  10: { nombre: "Dificultad Maxima", columnas: 4 },
};

const Memorama = () => {
  const navigate = useNavigate();

  const [numParejas, setNumParejas] = useState(4);
  const [cartas, setCartas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]); // Guarda los indices [index1, index2]
  const [encontrados, setEncontrados] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [mensaje, setMensaje] = useState({
    texto: "Toca dos tarjetas para buscar una pareja.",
    tipo: "",
  });
  const audioSeleccionar = new Audio(sonidoSeleccionar);
  const audioCorrecto = new Audio(sonidoCorrecto);
  const audioFallo = new Audio(sonidoFallo);
  const audioTictac = new Audio(sonidoTictac);
  const audioReset = new Audio(sonidoReset);
  const audioCorrectoLargo = new Audio(sonidoCorrectoLargo);
  const audioSwap = new Audio(sonidoSwap);
  const inicializarJuego = useCallback(
    (reset = false) => {
      const seleccionados = EMOJIS_BASE.slice(0, numParejas);
      const mazo = [...seleccionados, ...seleccionados]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({
          id: index,
          emoji,
          revelada: false,
          emparejada: false,
        }));
      if (reset) {
        audioReset.play();
      }
      setCartas(mazo);
      setEncontrados(0);
      setSeleccionadas([]);
      setBloqueado(false);
      setMensaje({
        texto: "Toca dos tarjetas para buscar una pareja.",
        tipo: "",
      });
    },
    [numParejas],
  );

  // Iniciar al montar el componente o cambiar dificultad
  useEffect(() => {
    inicializarJuego();
  }, [inicializarJuego]);

  const alHacerClick = (index) => {
    const carta = cartas[index];

    if (
      bloqueado ||
      carta.revelada ||
      carta.emparejada ||
      seleccionadas.includes(index)
    )
      return;

    const nuevasCartas = [...cartas];
    nuevasCartas[index].revelada = true;
    setCartas(nuevasCartas);

    const nuevaSeleccion = [...seleccionadas, index];
    setSeleccionadas(nuevaSeleccion);

    if (nuevaSeleccion.length === 1) {
      setMensaje({ texto: "Elige otra tarjeta.", tipo: "" });
      audioSeleccionar.play();
    } else if (nuevaSeleccion.length === 2) {
      audioSeleccionar.play();
      revisarPareja(nuevaSeleccion, nuevasCartas);
    }
  };

  const revisarPareja = (seleccion, tableroActual) => {
    setBloqueado(true);

    const [idx1, idx2] = seleccion;
    const coinciden = tableroActual[idx1].emoji === tableroActual[idx2].emoji;

    setTimeout(() => {
      if (coinciden) {
        tableroActual[idx1].emparejada = true;
        tableroActual[idx2].emparejada = true;
        const nuevosEncontrados = encontrados + 1;
        setEncontrados(nuevosEncontrados);
        audioCorrecto.play();

        if (nuevosEncontrados === numParejas) {
          audioCorrectoLargo.play();
          setMensaje({
            texto: `¡Muy bien! Completaste el tablero`,
            tipo: "success",
          });
        } else {
          setMensaje({ texto: "Encontraste una pareja.", tipo: "success" });
        }
      } else {
        tableroActual[idx1].revelada = false;
        tableroActual[idx2].revelada = false;
        setMensaje({
          texto: "No eran iguales. Intenta de nuevo.",
          tipo: "notice",
        });
        audioFallo.play();
      }

      setCartas([...tableroActual]);
      setSeleccionadas([]);
      setBloqueado(false);
    }, 900);
  };

  const verBrevemente = () => {
    if (bloqueado) return;
    setBloqueado(true);
    const original = [...cartas];

    // Revelar todas las no emparejadas
    setCartas(cartas.map((c) => ({ ...c, revelada: true })));
    setMensaje({ texto: "Observa las tarjetas un momento.", tipo: "notice" });

    audioTictac.play();
    setTimeout(() => {
      setCartas(original.map((c) => ({ ...c, revelada: c.emparejada })));
      setBloqueado(false);
      setMensaje({
        texto: "Toca dos tarjetas para buscar una pareja.",
        tipo: "",
      });
    }, 1200);
  };

  return (
    <article className="memory-game">
      <GameHeader title="Memorama" />
      <div className="general-actions">
        <button className="reset-button" onClick={() => inicializarJuego(true)}>
          <i className="fa-solid fa-rotate-right"></i> Reiniciar
        </button>
        <button className="button-secondary" onClick={verBrevemente}>
          <i className="fa-solid fa-eye"></i> Ver un momento
        </button>
      </div>
      <div
        className="memory-board"
        style={{ "--columns": DIFICULTADES[numParejas].columnas }}
      >
        {cartas.map((carta, index) => (
          <button
            key={carta.id}
            className={`memory-card ${carta.revelada ? "flipped" : ""} ${carta.emparejada ? "matched" : ""}`}
            onClick={() => alHacerClick(index)}
            disabled={bloqueado || carta.emparejada}
          >
            {carta.revelada || carta.emparejada ? carta.emoji : "?"}
          </button>
        ))}
      </div>

      <div className="memory-controls">
        <div className="difficulty-buttons">
          {[4, 6, 8, 10].map((n) => (
            <button
              key={n}
              className={`difficulty-btn ${numParejas === n ? "active" : ""}`}
              onClick={() => {
                audioSwap.play();
                setNumParejas(n);
              }}
            >
              {DIFICULTADES[n].nombre}
              <span>{n} parejas</span>
            </button>
          ))}
        </div>
      </div>

      <p className={`memory-message ${mensaje.tipo}`}>{mensaje.texto}</p>
    </article>
  );
};

export default Memorama;
