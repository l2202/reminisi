import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import "../styles/register.css"
const initialForm = {
  email: "",
  password: "",
  nombrepaciente: "",
  nombrecuidador: "",
  fechanac: "",
  telcuidador: "",
  profesionpaciente: "",
  direccionpaciente: "",
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;

    if (!userId) {
      setError("No se pudo obtener el usuario creado en Supabase Auth.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .schema("reminisi")
      .from("paciente")
      .insert({
        id: userId,
        nombrepaciente: form.nombrepaciente,
        nombrecuidador: form.nombrecuidador,
        fechanac: form.fechanac,
        telcuidador: form.telcuidador,
        profesionpaciente: form.profesionpaciente,
        direccionpaciente: form.direccionpaciente,
      });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();

    setMessage("Registro creado correctamente");
    setForm(initialForm);
    setLoading(false);
    navigate("/login", {
      state: { message: "Registro creado correctamente. Inicia sesion." },
      replace: true,
    });
  }

  return (
    <div className="form-container">
      <h2>Crear Cuenta</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo electronico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          minLength={6}
          required
        />

        <h3>Datos del paciente</h3>

        <input
          type="text"
          name="nombrepaciente"
          placeholder="Nombre del paciente"
          value={form.nombrepaciente}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nombrecuidador"
          placeholder="Nombre del cuidador"
          value={form.nombrecuidador}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="fechanac"
          value={form.fechanac}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telcuidador"
          placeholder="Telefono del cuidador"
          value={form.telcuidador}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="profesionpaciente"
          placeholder="Profesion del paciente"
          value={form.profesionpaciente}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccionpaciente"
          placeholder="Direccion del paciente"
          value={form.direccionpaciente}
          onChange={handleChange}
          required
        />

        {error && <p role="alert">Error al registrar: {error}</p>}
        {message && <p>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}
