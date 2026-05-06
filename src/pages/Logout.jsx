import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

export default function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loading) return;

    setError("");
    setLoading(true);

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      setLoading(false);
      return;
    }

    navigate("/login", {
      state: { message: "Sesion cerrada correctamente." },
      replace: true,
    });
  }

  return (
    <div className="form-container">
      <h2>Cerrar sesion</h2>
      <p>Esto cerrara la sesion guardada en este dispositivo.</p>

      {error && <p role="alert">Error al cerrar sesion: {error}</p>}

      <button onClick={handleLogout} disabled={loading}>
        {loading ? "Cerrando..." : "Cerrar sesion"}
      </button>
    </div>
  );
}
