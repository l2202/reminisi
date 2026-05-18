import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import "../styles/register.css";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [authMode, setAuthMode] = useState("login");
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [message, setMessage] = useState(location.state?.message ?? "");
    const [error, setError] = useState("");

      useEffect(() => {
        let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!active) return;

      if (data.session) {
        navigate("/", { replace: true });
        return;
      }

      setCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/", { replace: true });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    if(loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/", { replace: true });
  }

  async function handlePasswordRecovery(event) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      resetEmail,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      },
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setMessage("Te enviamos un enlace para recuperar tu contrasena.");
    setLoading(false);
    setAuthMode("login");
  }

  if (checkingSession) {
    return (
      <div className="form-container">
        <h2>Iniciar sesion</h2>
        <p>Revisando sesion guardada...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>
        Iniciar sesion
      </h2>

      {authMode === "login" && (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electronico"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contrasena"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {message && <p>{message}</p>}
          {error && <p role="alert">Error al iniciar sesion: {error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            className="text-form-button"
            onClick={() => {
              setAuthMode("forgot");
              setError("");
              setMessage("");
              setResetEmail(email);
            }}
          >
            Recuperar contrasena
          </button>
        </form>
      )}

      {authMode === "forgot" && (
        <form onSubmit={handlePasswordRecovery}>
          <input
            type="email"
            placeholder="Correo electronico"
            value={resetEmail}
            onChange={(event) => setResetEmail(event.target.value)}
            required
          />

          {message && <p>{message}</p>}
          {error && <p role="alert">Error al recuperar contrasena: {error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>

          <button
            type="button"
            className="text-form-button"
            onClick={() => {
              setAuthMode("login");
              setError("");
              setMessage("");
            }}
          >
            Volver a iniciar sesion
          </button>
        </form>
      )}
    </div>
  );
}
