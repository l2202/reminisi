import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/patrones.css";
import GameHeader from "../components/GameHeader";
import sonidoSeleccionar from "../assets/audio/select2.mp3";
import sonidoCorrecto from "../assets/audio/correcto_largo.wav";
import sonidoFallo from "../assets/audio/fallo_largo.wav";
import sonidoAlerta from "../assets/audio/alerta.mp3";

export default function Patrones() {
  const navigate = useNavigate();

  const [nivel, setNivel] = useState(1);
  const [pattern, setPattern] = useState([]);
  const [selected, setSelected] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const [bloqueado, setBloqueado] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const audioSeleccionar = new Audio(sonidoSeleccionar);
  const audioCorrecto = new Audio(sonidoCorrecto);
  const audioFallo = new Audio(sonidoFallo);
  const audioAlerta = new Audio(sonidoAlerta);

  const size = obtenerTamano(nivel);
  const totalCells = size * size;
  function obtenerTamano(nivel) {
    if (nivel >= 22) return 6;
    if (nivel >= 10) return 5;
    return 4;
  }

  function generarPattern(nivel) {
    const cantidad = Math.min(3 + nivel, totalCells);
    const indices = new Set();

    while (indices.size < cantidad) {
      indices.add(Math.floor(Math.random() * totalCells));
    }

    return [...indices];
  }

  function iniciarRonda() {
    const nuevoPattern = generarPattern(nivel);

    setPattern(nuevoPattern);
    setSelected([]);
    setMostrar(true);
    setBloqueado(true);
    setMensaje("Observa...");
    audioAlerta.play();
    setTimeout(() => {
      setMostrar(false);
      setBloqueado(false);
      setMensaje("Ahora selecciona");
    }, 1000);
  }

  function handleClick(index) {
    if (bloqueado) return;

    if (selected.includes(index)) return;

    const nuevos = [...selected, index];
    setSelected(nuevos);

    if (!pattern.includes(index)) {
      
      setBloqueado(true);
      audioFallo.play();
      mostrarPatronTemporal(false);
      setTimeout(() => {
        setNivel(1);
        iniciarRonda();
      }, 1200);
      return;
    }
    audioSeleccionar.play();

    // si completó todos
    if (nuevos.length === pattern.length) {
      setMensaje("Correcto ✅");
      setBloqueado(true);
      audioCorrecto.play();      
      setTimeout(() => {
        setNivel((n) => n + 1);
      }, 1000);
    }
  }

  function mostrarPatronTemporal(perdio = false) {
    if (mostrar || bloqueado) return; // evita bugs

    setMostrar(true);
    setBloqueado(true);
    perdio ? setMensaje("Observa otra vez...") : setMensaje("Incorrecto ❌");
    perdio ? audioAlerta.play() : false;

    setTimeout(() => {
      setMostrar(false);
      setBloqueado(false);
      setMensaje("Continúa");
    }, 800); // puedes ajustar tiempo
  }
  useEffect(() => {
    iniciarRonda();
  }, []);

  useEffect(() => {
    iniciarRonda();
  }, [nivel]);

  return (
    <div className="pattern-game">
      <GameHeader title="Recuerda el patron" />
      <h2>Nivel {nivel}</h2>
      <p>{mensaje}</p>

      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: "10px",
        }}
      >
        {Array.from({ length: totalCells }).map((_, i) => {
          const esPattern = pattern.includes(i);
          const esSeleccionado = selected.includes(i);

          let clase = "cell";

          if (mostrar && esPattern) clase += " show";
          if (esSeleccionado) clase += " selected";

          return (
            <div key={i} className={clase} onClick={() => handleClick(i)} />
          );
        })}
      </div>

      <button onClick={mostrarPatronTemporal}>Mostrar patrón</button>
    </div>
  );
}
