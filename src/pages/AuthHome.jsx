import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import "../styles/authHome.css";
import GameHeader from "../components/GameHeader";
export default function AuthHome() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!active) return;

      setHasSession(Boolean(data.session));
      setCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setHasSession(Boolean(session));
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checkingSession) {
    return (
      <div className="auth-container">
        <h1>Bienvenido</h1>
        <p>Revisando sesion...</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <GameHeader title="Gestion de cuenta" />
      <h1>Bienvenido</h1>
      <p>Seleccione una opcion</p>
      <div className="auth-options">
        {!hasSession && (
          <button className="btn-login" onClick={() => navigate("/login")}>
            Iniciar sesion
          </button>
        )}

        <button className="btn-register" onClick={() => navigate("/register")}>
          Crear cuenta
        </button>

        {hasSession && (
          <button className="btn-logout" onClick={() => navigate("/logout")}>
            Cerrar sesion
          </button>
        )}
      </div>
    </div>
  );
}
