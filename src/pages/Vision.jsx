import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faStop, faVideo } from "@fortawesome/free-solid-svg-icons";
import GameHeader from "../components/GameHeader";
import "../styles/vision.css";

const MIN_SCORE = 0.5;

const etiquetas = {
  person: "persona",
  bicycle: "bicicleta",
  car: "auto",
  motorcycle: "motocicleta",
  airplane: "avion",
  bus: "autobus",
  train: "tren",
  truck: "camion",
  boat: "barco",
  "traffic light": "semaforo",
  "fire hydrant": "hidrante",
  "stop sign": "señal de alto",
  bench: "banca",
  bird: "ave",
  cat: "gato",
  dog: "perro",
  horse: "caballo",
  sheep: "oveja",
  cow: "vaca",
  elephant: "elefante",
  bear: "oso",
  zebra: "cebra",
  giraffe: "jirafa",
  backpack: "mochila",
  umbrella: "paraguas",
  handbag: "bolsa",
  tie: "corbata",
  suitcase: "maleta",
  frisbee: "frisbee",
  skis: "esquis",
  snowboard: "snowboard",
  "sports ball": "pelota",
  kite: "papalote",
  "baseball bat": "bate",
  "baseball glove": "guante",
  skateboard: "patineta",
  surfboard: "tabla de surf",
  "tennis racket": "raqueta",
  bottle: "botella",
  "wine glass": "copa",
  cup: "taza",
  fork: "tenedor",
  knife: "cuchillo",
  spoon: "cuchara",
  bowl: "tazon",
  banana: "platano",
  apple: "manzana",
  sandwich: "sandwich",
  orange: "naranja",
  broccoli: "brocoli",
  carrot: "zanahoria",
  "hot dog": "hot dog",
  pizza: "pizza",
  donut: "dona",
  cake: "pastel",
  chair: "silla",
  couch: "sillon",
  "potted plant": "planta",
  bed: "cama",
  "dining table": "mesa",
  toilet: "inodoro",
  tv: "television",
  laptop: "laptop",
  mouse: "mouse",
  remote: "control remoto",
  keyboard: "teclado",
  "cell phone": "celular",
  microwave: "microondas",
  oven: "horno",
  toaster: "tostador",
  sink: "lavabo",
  refrigerator: "refrigerador",
  book: "libro",
  clock: "reloj",
  vase: "florero",
  scissors: "tijeras",
  "teddy bear": "peluche",
  "hair drier": "secadora",
  toothbrush: "cepillo de dientes",
};

const traducirEtiqueta = (label) => etiquetas[label] || label;

const limpiarCanvas = (canvas) => {
  const context = canvas?.getContext("2d");
  if (context && canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
};

const dibujarDetecciones = (canvas, detecciones) => {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 4;
  context.font = "18px Segoe UI, sans-serif";
  context.textBaseline = "top";

  detecciones.forEach((deteccion) => {
    const [x, y, width, height] = deteccion.bbox;
    const label = `${traducirEtiqueta(deteccion.class)} ${Math.round(
      deteccion.score * 100,
    )}%`;
    const textWidth = context.measureText(label).width;
    const textY = y > 28 ? y - 28 : y + 6;

    context.strokeStyle = "#00bfa5";
    context.fillStyle = "rgba(0, 191, 165, 0.16)";
    context.strokeRect(x, y, width, height);
    context.fillRect(x, y, width, height);

    context.fillStyle = "#00bfa5";
    context.fillRect(x, textY, textWidth + 18, 26);
    context.fillStyle = "#ffffff";
    context.fillText(label, x + 9, textY + 4);
  });
};

const Vision = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const [model, setModel] = useState(null);
  const [modelStatus, setModelStatus] = useState("Cargando modelo...");
  const [cameraActive, setCameraActive] = useState(false);
  const [detections, setDetections] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarModelo() {
      try {
        const modelo = await cocoSsd.load();

        if (!activo) return;

        setModel(modelo);
        setModelStatus("Modelo listo");
      } catch {
        if (!activo) return;

        setModelStatus("No se pudo cargar el modelo");
        setError("Revisa tu conexion e intenta recargar la pagina.");
      }
    }

    cargarModelo();

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (!cameraActive || !model) return undefined;

    let cancelado = false;

    async function detectarObjetos() {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || cancelado) return;

      if (video.readyState >= 2 && video.videoWidth > 0) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const resultados = await model.detect(video);
        if (cancelado) return;

        const objetosVisibles = resultados
          .filter((resultado) => resultado.score >= MIN_SCORE)
          .slice(0, 6);

        setDetections(objetosVisibles);
        dibujarDetecciones(canvas, objetosVisibles);
      }

      frameRef.current = requestAnimationFrame(detectarObjetos);
    }

    detectarObjetos();

    return () => {
      cancelado = true;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [cameraActive, model]);

  const detenerCamara = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    limpiarCanvas(canvasRef.current);
    setCameraActive(false);
    setDetections([]);
  };

  useEffect(() => detenerCamara, []);

  const iniciarCamara = async () => {
    setError("");

    if (!model) {
      setError("Espera a que el modelo termine de cargar.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este navegador no permite acceder a la camara.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraActive(true);
    } catch {
      setError(
        "No se pudo acceder a la camara. Revisa los permisos del navegador.",
      );
    }
  };

  return (
    <div className="vision-page">
      <GameHeader title="Reconocer Objetos" />

      <section className="vision-panel" aria-label="Detector de objetos">
        <div className="vision-controls">
          <p className="vision-status">{modelStatus}</p>
          <button
            className={cameraActive ? "vision-stop-btn" : "vision-start-btn"}
            onClick={cameraActive ? detenerCamara : iniciarCamara}
            type="button"
          >
            <FontAwesomeIcon icon={cameraActive ? faStop : faCamera} />
            {cameraActive ? "Detener camara" : "Iniciar camara"}
          </button>
        </div>
        <div className="vision-camera">
          {!cameraActive && (
            <div className="vision-placeholder">
              <FontAwesomeIcon icon={faVideo} />
              <p>Activa la camara para identificar objetos</p>
            </div>
          )}
          <video
            ref={videoRef}
            className="vision-video"
            muted
            playsInline
            aria-label="Vista de la camara"
          />
          <canvas ref={canvasRef} className="vision-canvas" />
        </div>

        {error && (
          <p className="vision-error" role="alert">
            {error}
          </p>
        )}

        <div className="vision-results">
          <h2>Objetos detectados</h2>
          {detections.length > 0 ? (
            <ul>
              {detections.map((deteccion) => (
                <li key={`${deteccion.class}-${deteccion.score}`}>
                  <span>{traducirEtiqueta(deteccion.class)}</span>
                  <strong>{Math.round(deteccion.score * 100)}%</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="vision-empty">
              {cameraActive
                ? "Apunta la camara hacia un objeto."
                : "Sin detecciones todavia."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Vision;
