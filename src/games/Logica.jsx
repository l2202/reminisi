import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/logica.css";
import GameHeader from "../components/GameHeader";
const categorias = [
  {
    nombre: "Frutas",
    grupo: ["🍎", "🍌", "🍇", "🍓", "🍉", "🍒", "🍍", "🥝"],
    intrusos: ["🚗", "🐶", "📱", "⚽"],
  },

  {
    nombre: "Animales",
    grupo: ["🐶", "🐱", "🐭", "🐸", "🦊", "🐻", "🐰", "🦁"],
    intrusos: ["🍕", "🚀", "🎵", "📚"],
  },

  {
    nombre: "Comida",
    grupo: ["🍕", "🍔", "🌮", "🍟", "🍩", "🍪", "🍝", "🥗"],
    intrusos: ["🐢", "🚲", "🎧", "🌙"],
  },

  {
    nombre: "Objetos",
    grupo: ["📱", "💻", "⌚", "🎧", "📷", "🖨️", "💡", "📺"],
    intrusos: ["🐶", "🍎", "🌻", "⚽"],
  },

  {
    nombre: "Vehículos",
    grupo: ["🚗", "🚕", "🚌", "🚓", "🚑", "🚜", "🏍️", "🚲"],
    intrusos: ["🍎", "🐱", "🎂", "📚"],
  },

  {
    nombre: "Flores y plantas",
    grupo: ["🌹", "🌻", "🌷", "🌼", "🌺", "🌸", "🍀"],
    intrusos: ["🚀", "🍔", "🐶", "🎧"],
  },

  {
    nombre: "Deportes",
    grupo: ["⚽", "🏀", "🏈", "🎾", "🏐", "🥎", "🏓", "🏸"],
    intrusos: ["🍕", "📱", "🐱", "🚗"],
  },

  {
    nombre: "Clima",
    grupo: ["☀️", "🌧️", "⛈️", "❄️", "🌈", "🌪️", "☁️", "🌤️"],
    intrusos: ["🍔", "🐸", "🚲", "🎵"],
  },

  {
    nombre: "Ropa",
    grupo: ["👕", "👖", "🧥", "👗", "🧢", "👟", "🧦", "🧤"],
    intrusos: ["🍇", "🚀", "🐱", "⚽"],
  },

  {
    nombre: "Música",
    grupo: ["🎵", "🎶", "🎸", "🥁", "🎹", "🎺", "🎻", "🎤"],
    intrusos: ["🚑", "🍉", "🐶", "📚"],
  },

  {
    nombre: "Casa",
    grupo: ["🛏️", "🛋️", "🚪", "🪑", "🚽", "🛁", "🧹"],
    intrusos: ["🦁", "⚽", "🍩", "🚀"],
  },

  {
    nombre: "Escuela",
    grupo: ["📚", "✏️", "🖍️", "📓", "📐", "🖊️", "🧮", "🎒"],
    intrusos: ["🍔", "🐶", "🚓", "🌹"],
  },

  {
    nombre: "Espacio",
    grupo: ["🌎", "🌙", "⭐", "☄️", "🪐", "🚀", "🌌", "🌠"],
    intrusos: ["🍕", "🐱", "👕", "🚲"],
  },

  {
    nombre: "Caras felices",
    grupo: ["😀", "😄", "😁", "😊", "🙂", "😃", "😎", "🥳"],
    intrusos: ["😡", "😭", "👻", "💀"],
  },

  {
    nombre: "Mar",
    grupo: ["🐟", "🐠", "🦀", "🐙", "🐬", "🦈", "🌊", "🐚"],
    intrusos: ["🍔", "🚗", "📚", "🌹"],
  },
];
export default function Logica() {
  const navigate = useNavigate();

  const [opciones, setOpciones] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [mensaje, setMensaje] = useState("Selecciona el emoji diferente");
  const [bloqueado, setBloqueado] = useState(false);

  function mezclar(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function nuevaRonda() {
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];

    // Elegir 3 del grupo
    const normales = mezclar(categoria.grupo).slice(0, 3);

    // Elegir 1 intruso
    const intruso =
      categoria.intrusos[Math.floor(Math.random() * categoria.intrusos.length)];

    // Mezclar opciones
    const todas = mezclar([...normales, intruso]);

    setOpciones(todas);
    setRespuesta(intruso);

    setMensaje("Selecciona el emoji diferente");
    setBloqueado(false);
  }

  function seleccionar(emoji) {
    if (bloqueado) return;

    setBloqueado(true);

    if (emoji === respuesta) {
      setMensaje("Correcto ✅");

      setTimeout(() => {
        nuevaRonda();
      }, 1000);
    } else {
      setMensaje(`Incorrecto ❌`);

      setTimeout(() => {
        nuevaRonda();
      }, 1000);
    }
  }

  useEffect(() => {
    nuevaRonda();
  }, []);

  return (
    <div className="intruso-game page">
      <GameHeader title="Emoji intruso" />

      <div className="intruso-header card">
        <p>{mensaje}</p>
      </div>

      <div className="intruso-grid">
        {opciones.map((emoji, index) => (
          <button
            key={index}
            className={`intruso-btn ${
              bloqueado && emoji === respuesta ? "correct" : ""
            }`}
            onClick={() => seleccionar(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
