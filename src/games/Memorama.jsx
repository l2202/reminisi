import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/memorama.css";
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

  const inicializarJuego = useCallback(() => {
    const seleccionados = EMOJIS_BASE.slice(0, numParejas);
    const mazo = [...seleccionados, ...seleccionados]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        revelada: false,
        emparejada: false,
      }));

    setCartas(mazo);
    setEncontrados(0);
    setSeleccionadas([]);
    setBloqueado(false);
    setMensaje({
      texto: "Toca dos tarjetas para buscar una pareja.",
      tipo: "",
    });
  }, [numParejas]);

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
    } else if (nuevaSeleccion.length === 2) {
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

        if (nuevosEncontrados === numParejas) {
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
      <div className="navigate-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Memorama</h1>
      </div>
      <div className="memory-actions">
        <button className="memory-secondary" onClick={inicializarJuego}>
          <i className="fa-solid fa-rotate-right"></i> Reiniciar
        </button>
        <button className="memory-secondary" onClick={verBrevemente}>
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
      {/* <div className="memory-status">
        <div>
          <span>Parejas</span>
          <strong>
            {encontrados}/{numParejas}
          </strong>
        </div>
        <div>
          <span>Intentos</span>
          <strong>{intentos}</strong>
        </div>
        <div>
          <span>Dificultad</span>
          <strong>{DIFICULTADES[numParejas].nombre}</strong>
        </div>
      </div> */}
      <div className="memory-controls">
          {/* <div>
            <h2>Elije la dificultad</h2>
          </div> */}

        <div className="difficulty-buttons">
          {[4, 6, 8, 10].map((n) => (
            <button
              key={n}
              className={`difficulty-btn ${numParejas === n ? "active" : ""}`}
              onClick={() => setNumParejas(n)}
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
