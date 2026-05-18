import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import "../styles/register.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [canUpdatePassword, setCanUpdatePassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function checkRecoverySession() {
      const { data } = await supabase.auth.getSession();

      if (!active) return;

      if (!data.session) {
        setError("El enlace de recuperación no es válido o ya expiró.");
      } else {
        setCanUpdatePassword(true);
      }

      setCheckingSession(false);
    }

    checkRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setError("");
        setCanUpdatePassword(true);
        setCheckingSession(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleUpdatePassword(event) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();

    setLoading(false);
    setMessage("Contraseña actualizada correctamente.");
    navigate("/login", {
      state: { message: "Contraseña actualizada correctamente. Inicia sesión." },
      replace: true,
    });
  }

  if (checkingSession) {
    return (
      <div className="form-container">
        <h2>Nueva contraseña</h2>
        <p>Revisando enlace de recuperación...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Nueva contraseña</h2>

      <form onSubmit={handleUpdatePassword}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          minLength={6}
          required
          disabled={loading || !canUpdatePassword}
        />
        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={6}
          required
          disabled={loading || !canUpdatePassword}
        />

        {message && <p>{message}</p>}
        {error && <p role="alert">Error al actualizar contrasena: {error}</p>}

        <button type="submit" disabled={loading || !canUpdatePassword}>
          {loading ? "Guardando..." : "Guardar contraseña"}
        </button>

        <button
          type="button"
          className="text-form-button"
          onClick={() => navigate("/login", { replace: true })}
        >
          Volver a iniciar sesión
        </button>
      </form>
    </div>
  );
}
