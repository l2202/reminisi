import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const configuracionNiveles = [
  { max: 10, operadores: ["+"] },
  { max: 20, operadores: ["+", "-"] },
  { max: 40, operadores: ["+", "-"] },
  { max: 10, operadores: ["+", "-", "x", "x"] },
  { max: 20, operadores: ["+", "-", "x"] },
  { max: 60, operadores: ["+", "-"] },
  { max: 60, operadores: ["+", "-", "x"] },
];

export default function Operaciones() {
  const navigate = useNavigate();

  const [nivel, setNivel] = useState(1);
  const [aciertos, setAciertos] = useState(0);
  const [racha, setRacha] = useState(0);
  const [respuesta, setRespuesta] = useState(0);
  const [operacion, setOperacion] = useState("");
  const [opciones, setOpciones] = useState([]);
  const [mensaje, setMensaje] = useState("Elige la respuesta correcta.");
  const [bloqueado, setBloqueado] = useState(false);

  function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function mezclarOpciones(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function obtenerConfiguracion() {
    return configuracionNiveles[nivel - 1];
  }

  function crearOperacion() {
    const config = obtenerConfiguracion();
    const operador =
      config.operadores[numeroAleatorio(0, config.operadores.length - 1)];

    let a = numeroAleatorio(1, config.max);
    let b = numeroAleatorio(1, config.max);
    let resultado = 0;

    if (operador === "+") resultado = a + b;

    if (operador === "-") {
      if (b > a) [a, b] = [b, a];
      resultado = a - b;
    }

    if (operador === "x") {
      let a = numeroAleatorio(1, config.max / 2);
      let b = numeroAleatorio(1, config.max / 2);
      resultado = a * b;
    }

    return {
      texto: `${a} ${operador} ${b}`,
      resultado,
    };
  }

  function crearOpciones(correcta) {
    const opcionesSet = new Set([correcta]);
    const margen = Math.max(3, nivel * 3);

    while (opcionesSet.size < 4) {
      const variacion = numeroAleatorio(-margen, margen);
      const opcion = correcta + variacion;

      if (opcion >= 0) {
        opcionesSet.add(opcion);
      }
    }

    return mezclarOpciones([...opcionesSet]);
  }

  function nuevaOperacion() {
    const nueva = crearOperacion();

    setOperacion(nueva.texto);
    setRespuesta(nueva.resultado);
    setOpciones(crearOpciones(nueva.resultado));
    setBloqueado(false);
    setMensaje("Elige la respuesta correcta.");
  }

  function actualizarDificultad(acerto) {
    if (acerto) {
      setAciertos((prev) => prev + 1);

      const nuevaRacha = racha + 1;
      setRacha(nuevaRacha);

      if (nuevaRacha >= 3 && nivel < configuracionNiveles.length) {
        setNivel((prev) => prev + 1);
        setRacha(0);
      }
    } else {
      setRacha(0);

      if (nivel > 1) {
        setNivel((prev) => prev - 1);
      }
    }
  }

  function revisarRespuesta(valor) {
    if (bloqueado) return;

    const acerto = valor === respuesta;
    setBloqueado(true);

    if (acerto) {
      setMensaje("Muy bien. Vamos con otra.");
    } else {
      setMensaje(`La respuesta era ${respuesta}.`);
    }

    actualizarDificultad(acerto);

    setTimeout(() => {
      nuevaOperacion();
    }, 1400);
  }

  function reiniciarJuego() {
    setNivel(1);
    setAciertos(0);
    setRacha(0);
    setTimeout(() => {
      nuevaOperacion();
    }, 100);
  }

  useEffect(() => {
    nuevaOperacion();
  }, []);

  return (
    <div className="math-game">
      <div className="navigate-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Operaciones</h1>
      </div>

      <div className="math-status">
        <div>
          <span>Nivel</span>
          <strong>{nivel}</strong>
        </div>

        <div>
          <span>Aciertos</span>
          <strong>{aciertos}</strong>
        </div>

        <div>
          <span>Racha</span>
          <strong>{racha}</strong>
        </div>
      </div>

      <div className="math-card">
        <p>Resuelve con calma</p>
        <h2>¿Cuánto es?</h2>
        <p className="operation-text">{operacion}</p>
      </div>

      <div className="answer-grid">
        {opciones.map((opcion, index) => (
          <button
            key={index}
            className="answer-btn"
            disabled={bloqueado}
            onClick={() => revisarRespuesta(opcion)}
          >
            {opcion}
          </button>
        ))}
      </div>

      <p className="math-message">{mensaje}</p>

      <div className="math-actions">
        <button onClick={nuevaOperacion}>Otra operación</button>

        <button onClick={reiniciarJuego}>Reiniciar</button>
      </div>
    </div>
  );
}
