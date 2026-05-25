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
} from "@fortawesome/free-solid-svg-icons";
export default function Home() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

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
        navigate("/auth", { replace: true });
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
        <button className="btn-juegos" onClick={() => navigate("/MenuJuegos")}>
          <span>
            <FontAwesomeIcon icon={faDiceSix} />
          </span>
          Juegos
        </button>
        <button className="btn-datos" onClick={() => navigate("/InfoPersonal")}>
          <span>
            <FontAwesomeIcon icon={faInfo} />
          </span>
          Mis datos
        </button>
        <button
          className="btn-recuerdos"
          onClick={() => navigate("/MenuRecuerdos")}
        >
          <span>
            <FontAwesomeIcon icon={faImages} />
          </span>
          Mis recuerdos
        </button>
        <button
          className="btn-vision"
          onClick={() => navigate("/vision")}
        >
          <span>
            <FontAwesomeIcon icon={faImages} />
          </span>
          Reconocer Objetos
        </button>
        <button className="btn-auth" onClick={() => navigate("/auth")}>
          <span>
            <FontAwesomeIcon icon={faKey} />
          </span>
          Mi cuenta
        </button>
      </div>
    </div>
  );
}
