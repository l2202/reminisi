import React, { useState, useEffect, useCallback } from 'react';

const EMOJIS_BASE = [
  "🌞", "🌙", "⭐", "🌈", "🌻", "🍎", "🍓", "🍋",
  "🐶", "🐱", "🐦", "🐢", "🚗", "🏠", "🎵", "❤️"
];

const DIFICULTADES = {
  4: { nombre: "Facil", columnas: 4 },
  6: { nombre: "Medio", columnas: 4 },
  8: { nombre: "Mayor reto", columnas: 4 }
};

const Memorama = () => {
  // --- ESTADO ---
  const [numParejas, setNumParejas] = useState(4);
  const [cartas, setCartas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]); // Guarda los indices [index1, index2]
  const [intentos, setIntentos] = useState(0);
  const [encontrados, setEncontrados] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "Toca dos tarjetas para buscar una pareja.", tipo: "" });

  // --- LÓGICA DE INICIO ---
  const inicializarJuego = useCallback(() => {
    const seleccionados = EMOJIS_BASE.slice(0, numParejas);
    const mazo = [...seleccionados, ...seleccionados]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        revelada: false,
        emparejada: false
      }));

    setCartas(mazo);
    setEncontrados(0);
    setIntentos(0);
    setSeleccionadas([]);
    setBloqueado(false);
    setMensaje({ texto: "Toca dos tarjetas para buscar una pareja.", tipo: "" });
  }, [numParejas]);

  // Iniciar al montar el componente o cambiar dificultad
  useEffect(() => {
    inicializarJuego();
  }, [inicializarJuego]);

  // --- ACCIONES ---
  const alHacerClick = (index) => {
    const carta = cartas[index];

    // Validaciones: no clickear si está bloqueado, si ya está revelada o si es la misma
    if (bloqueado || carta.revelada || carta.emparejada || seleccionadas.includes(index)) return;

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
    setIntentos(prev => prev + 1);

    const [idx1, idx2] = seleccion;
    const coinciden = tableroActual[idx1].emoji === tableroActual[idx2].emoji;

    setTimeout(() => {
      if (coinciden) {
        tableroActual[idx1].emparejada = true;
        tableroActual[idx2].emparejada = true;
        const nuevosEncontrados = encontrados + 1;
        setEncontrados(nuevosEncontrados);

        if (nuevosEncontrados === numParejas) {
          setMensaje({ texto: `¡Muy bien! Completaste el tablero en ${intentos + 1} intentos.`, tipo: "success" });
        } else {
          setMensaje({ texto: "Encontraste una pareja.", tipo: "success" });
        }
      } else {
        tableroActual[idx1].revelada = false;
        tableroActual[idx2].revelada = false;
        setMensaje({ texto: "No eran iguales. Intenta de nuevo.", tipo: "notice" });
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
    setCartas(cartas.map(c => ({ ...c, revelada: true })));
    setMensaje({ texto: "Observa las tarjetas un momento.", tipo: "notice" });

    setTimeout(() => {
      setCartas(original.map(c => ({ ...c, revelada: c.emparejada })));
      setBloqueado(false);
      setMensaje({ texto: "Toca dos tarjetas para buscar una pareja.", tipo: "" });
    }, 1200);
  };

  return (
    <article className="memory-game">
      <div className="memory-controls">
        <div>
          <p className="memory-kicker">Elige una dificultad</p>
          <h2>Encuentra las parejas</h2>
        </div>

        <div className="difficulty-buttons">
          {[4, 6, 8].map(n => (
            <button 
              key={n}
              className={`difficulty-btn ${numParejas === n ? 'active' : ''}`}
              onClick={() => setNumParejas(n)}
            >
              {DIFICULTADES[n].nombre}
              <span>{n} parejas</span>
            </button>
          ))}
        </div>
      </div>

      <div className="memory-status">
        <div><span>Parejas</span><strong>{encontrados}/{numParejas}</strong></div>
        <div><span>Intentos</span><strong>{intentos}</strong></div>
        <div><span>Dificultad</span><strong>{DIFICULTADES[numParejas].nombre}</strong></div>
      </div>

      <p className={`memory-message ${mensaje.tipo}`}>{mensaje.texto}</p>

      <div 
        className="memory-board" 
        style={{ '--columns': DIFICULTADES[numParejas].columnas }}
      >
        {cartas.map((carta, index) => (
          <button
            key={carta.id}
            className={`memory-card ${carta.revelada ? 'flipped' : ''} ${carta.emparejada ? 'matched' : ''}`}
            onClick={() => alHacerClick(index)}
            disabled={bloqueado || carta.emparejada}
          >
            {carta.revelada || carta.emparejada ? carta.emoji : '?'}
          </button>
        ))}
      </div>

      <div className="memory-actions">
        <button className="memory-secondary" onClick={inicializarJuego}>
          <i className="fa-solid fa-rotate-right"></i> Reiniciar
        </button>
        <button className="memory-secondary" onClick={verBrevemente}>
          <i className="fa-solid fa-eye"></i> Ver un momento
        </button>
      </div>
    </article>
  );
};

export default Memorama;