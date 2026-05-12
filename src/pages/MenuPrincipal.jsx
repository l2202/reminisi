import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import '../styles/home.css'
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
        <button className="btn-juegos" onClick={() => navigate("/MenuJuegos")}>Juegos</button>
        <button className="btn-datos" onClick={() => navigate("/InfoPersonal")}>Mis datos</button>
        {/* boton provicional para indicar la ruta de la pantalla de autenticacion, se retirara una vez que las base de datos y la conexion sean funcinales */}
        <button className="btn-auth" onClick={() => navigate("/auth")}>Autenticar</button>
      </div>
    </div>
  );
}
