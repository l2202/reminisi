import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import "../styles/home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiceSix,
  faInfo,
  faKey,
  faImages,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import sonidoSelect from "../assets/audio/select.mp3"

export default function Home() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  const audioSelect = new Audio(sonidoSelect);

  function navegarConSolido(ruta){
    audioSelect.play();
    setTimeout(() => {
      navigate(ruta);
    }, 120);
  }

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!active) return;

      if (!data.session) {
        navigate("/auth", { replace: true });
        return;
      }

      setCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navegarConSolido("/auth", { replace: true });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (checkingSession) {
    return (
      <div className="loading-screen">
        <h1>Reminisi</h1>
        <p>Revisando sesion...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div>
        <h1>Reminisi</h1>
      </div>
      <div className="home-grid">
        <button className="btn-juegos" onClick={() => navegarConSolido("/MenuJuegos")}>
          <span>
            <FontAwesomeIcon icon={faDiceSix} />
          </span>
          Juegos
        </button>
        <button className="btn-datos" onClick={() => navegarConSolido("/InfoPersonal")}>
          <span>
            <FontAwesomeIcon icon={faInfo} />
          </span>
          Mis datos
        </button>
        <button
          className="btn-recuerdos"
          onClick={() => navegarConSolido("/MenuRecuerdos")}
        >
          <span>
            <FontAwesomeIcon icon={faImages} />
          </span>
          Mis recuerdos
        </button>
        <button className="btn-vision" onClick={() => navegarConSolido("/vision")}>
          <span>
            <FontAwesomeIcon icon={faEye} />{" "}
          </span>
          Reconocer Objetos
        </button>
        <button className="btn-auth" onClick={() => navegarConSolido("/auth")}>
          <span>
            <FontAwesomeIcon icon={faKey} />
          </span>
          Mi cuenta
        </button>
      </div>
    </div>
  );
}
