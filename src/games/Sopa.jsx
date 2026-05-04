import { useState, useEffect } from "react";
import "./sopa.css";
import { useNavigate } from "react-router-dom";

const bancoPalabras = [
  "CASA",
  "FAMILIA",
  "MUSICA",
  "FOTO",
  "AMIGO",
  "JARDIN",
  "COMIDA",
  "LIBRO",
  "PLAYA",
  "PERRO",
  "GATO",
  "FLOR",
];

const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

const direcciones = [
  { fila: 0, col: 1 },
  { fila: 1, col: 0 },
  { fila: 1, col: 1 },
];

export default function Sopa() {
    const navigate = useNavigate();

  const tamano = 10;
  const cantidadPalabras = 5;

  const [matriz, setMatriz] = useState([]);
  const [palabras, setPalabras] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [seleccion, setSeleccion] = useState([]);
  const [encontradas, setEncontradas] = useState(new Set());
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);
  const [celdasEncontradas, setCeldasEncontradas] = useState(new Set());

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const mezclar = (arr) => [...arr].sort(() => Math.random() - 0.5);

  function crearMatriz() {
    return Array.from({ length: tamano }, () =>
      Array.from({ length: tamano }, () => ""),
    );
  }

  function elegirPalabras() {
    return mezclar(bancoPalabras).slice(0, cantidadPalabras);
  }

  function cabe(m, palabra, f, c, dir) {
    for (let i = 0; i < palabra.length; i++) {
      const nf = f + dir.fila * i;
      const nc = c + dir.col * i;

      if (nf < 0 || nc < 0 || nf >= tamano || nc >= tamano) return false;
      if (m[nf][nc]) return false;
    }
    return true;
  }

  function colocar(m, palabra, ubic) {
    for (let i = 0; i < 120; i++) {
      const dir = direcciones[rand(0, direcciones.length - 1)];
      const f = rand(0, tamano - 1);
      const c = rand(0, tamano - 1);

      if (!cabe(m, palabra, f, c, dir)) continue;

      const celdas = [];

      for (let j = 0; j < palabra.length; j++) {
        const nf = f + dir.fila * j;
        const nc = c + dir.col * j;
        m[nf][nc] = palabra[j];
        celdas.push(`${nf}-${nc}`);
      }

      ubic.push({ palabra, celdas });
      return true;
    }
    return false;
  }

  function completar(m) {
    for (let i = 0; i < tamano; i++) {
      for (let j = 0; j < tamano; j++) {
        if (!m[i][j]) {
          m[i][j] = letras[rand(0, letras.length - 1)];
        }
      }
    }
  }

  function nuevaSopa() {
    const m = crearMatriz();
    const palabrasSel = elegirPalabras();
    const ubic = [];
    const finales = [];

    palabrasSel.forEach((p) => {
      if (colocar(m, p, ubic)) finales.push(p);
    });

    completar(m);

    setMatriz(m);
    setPalabras(finales);
    setUbicaciones(ubic);
    setSeleccion([]);
    setEncontradas(new Set());
    setBloqueado(false);
    setMensaje("Toca letras en orden");
  }

  function seleccionActual(nuevaSel) {
    return nuevaSel.join("|");
  }

  function coincideRuta(sel, celdas) {
    const normal = celdas.join("|");
    const reversa = [...celdas].reverse().join("|");
    return sel === normal || sel === reversa;
  }

  function esPrefijoValido(selArr, celdas) {
    const normal = celdas.slice(0, selArr.length).join("|");
    const reversa = [...celdas].reverse().slice(0, selArr.length).join("|");
    const sel = selArr.join("|");

    return sel === normal || sel === reversa;
  }

  function seleccionarCelda(fila, col) {
    if (bloqueado) return;

    const pos = `${fila}-${col}`;

    if (seleccion.includes(pos)) return;

    const nuevaSel = [...seleccion, pos];
    setSeleccion(nuevaSel);

    const selStr = seleccionActual(nuevaSel);

    const encontrada = ubicaciones.find(
      (u) => !encontradas.has(u.palabra) && coincideRuta(selStr, u.celdas),
    );

    if (encontrada) {
      const nuevasPalabras = new Set(encontradas);
      nuevasPalabras.add(encontrada.palabra);
      setEncontradas(nuevasPalabras);

      setCeldasEncontradas((prev) => {
        const nuevo = new Set(prev);
        encontrada.celdas.forEach((c) => nuevo.add(c));
        return nuevo;
      });
      setSeleccion([]);
      setMensaje(`Encontraste ${encontrada.palabra}`);

      return;
    }

    const prefijoValido = ubicaciones.some(
      (u) => !encontradas.has(u.palabra) && esPrefijoValido(nuevaSel, u.celdas),
    );

    if (!prefijoValido) {
      setBloqueado(true);
      setMensaje("Esa selección no forma palabra");

      setTimeout(() => {
        setSeleccion([]);
        setBloqueado(false);
        setMensaje("Intenta otra vez");
      }, 700);
    } else {
      setMensaje("Sigue...");
    }
  }

  useEffect(() => {
    nuevaSopa();
  }, []);

  return (
    <div className="word-game">
      <div className="navigate-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Sopa de letras</h1>
      </div>
      <p>{mensaje}</p>

      <div className="word-board">
        {matriz.map((fila, i) =>
          fila.map((letra, j) => {
            const pos = `${i}-${j}`;

            const isSelected = seleccion.includes(pos);

            const isFound = celdasEncontradas.has(pos);

            return (
              <button
                key={pos}
                className={`cell ${isSelected ? "selected" : ""} ${isFound ? "found" : ""}`}
                disabled={isFound}
                onClick={() => seleccionarCelda(i, j)}
              >
                {letra}
              </button>
            );
          }),
        )}
      </div>

      <div>
        {palabras.map((p) => (
          <div key={p} className={encontradas.has(p) ? "found" : ""}>
            {p}
          </div>
        ))}
      </div>

      <button onClick={() => setSeleccion([])}>Limpiar</button>

      <button onClick={nuevaSopa}>Nuevo</button>

      <p>
        {encontradas.size}/{palabras.length}
      </p>
    </div>
  );
}
