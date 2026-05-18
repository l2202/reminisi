import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import "../styles/infoPersonal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck,
  faCakeCandles,
  faBriefcase,
  faMapLocationDot,
  faHandHoldingMedical,
  faPhone,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import GameHeader from "../components/GameHeader";

function capitalizar(texto) {
  if (!texto) return "";

  return texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return "No disponible";

  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();
  const mesNacimiento = nacimiento.getMonth();
  const diaNacimiento = nacimiento.getDate();

  if (
    mesActual < mesNacimiento ||
    (mesActual === mesNacimiento && diaActual < diaNacimiento)
  ) {
    edad -= 1;
  }

  return `${edad} años`;
}

export default function InfoPersonal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");
  const [userData, setUserData] = useState(null);
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState("");

  const editableFields = {
    profesionpaciente: {
      label: "Mi profesión",
      inputLabel: "Nueva profesión",
      type: "text",
    },
    direccionpaciente: {
      label: "Mi dirección",
      inputLabel: "Nueva dirección",
      type: "text",
    },
    nombrecuidador: {
      label: "Nombre de cuidador",
      inputLabel: "Nuevo nombre",
      type: "text",
    },
    telcuidador: {
      label: "Teléfono del cuidador",
      inputLabel: "Nuevo teléfono",
      type: "tel",
    },
  };

  function openEditModal(fieldName) {
    setEditError("");
    setEditField(fieldName);
    setNewValue(userData?.[fieldName] ?? "");
  }

  function closeEditModal() {
    if (saving) return;
    setEditField(null);
    setNewValue("");
    setEditError("");
  }

  async function handleSaveEdit(event) {
    event.preventDefault();

    if (!editField || saving) return;

    const value = newValue.trim();

    if (!value) {
      setEditError("La nueva informacion no puede estar vacia.");
      return;
    }

    setSaving(true);
    setEditError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/auth", { replace: true });
      return;
    }

    const { error: updateError } = await supabase
      .schema("reminisi")
      .from("paciente")
      .update({ [editField]: value })
      .eq("id", session.user.id);

    if (updateError) {
      setEditError(updateError.message);
      setSaving(false);
      return;
    }

    setUserData((currentData) => ({
      ...currentData,
      [editField]: value,
    }));
    setSaving(false);
    setEditField(null);
    setNewValue("");
    setEditError("");
  }

  function renderEditButton(fieldName) {
    return (
      <button
        type="button"
        className="edit-info-button"
        aria-label={`Editar ${editableFields[fieldName].label}`}
        onClick={() => openEditModal(fieldName)}
      >
        <FontAwesomeIcon icon={faPen} />
      </button>
    );
  }

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data, error: profileError } = await supabase
        .schema("reminisi")
        .from("paciente")
        .select(
          "nombrepaciente, nombrecuidador, fechanac, telcuidador, profesionpaciente, direccionpaciente",
        )
        .eq("id", session.user.id)
        .single();

      if (!active) return;

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      setUserData(data);
      setLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="info-container">
      <GameHeader title="Mis datos" />

      {loading && <p>Cargando informacion...</p>}

      {error && !loading && (
        <p role="alert">Error al cargar los datos: {error}</p>
      )}

      {!loading && !error && userData && (
        <div className="info-list">
          <div className="info-card">
            <div className="icon">
              <FontAwesomeIcon icon={faUserCheck} />
            </div>
            <div className="info-content">
              <p className="label">Mi nombre</p>
              <p className="value">{capitalizar(userData.nombrepaciente)}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="icon">
              <FontAwesomeIcon icon={faCakeCandles} />{" "}
            </div>
            <div className="info-content">
              <p className="label">Mi edad</p>
              <p className="value">
                {capitalizar(calcularEdad(userData.fechanac))}
              </p>
            </div>
          </div>

          <div className="info-card">
            <div className="icon">
              <FontAwesomeIcon icon={faBriefcase} />
            </div>
            <div className="info-content">
              <p className="label">Mi profesión</p>
              <p className="value">{capitalizar(userData.profesionpaciente)}</p>
            </div>
            {renderEditButton("profesionpaciente")}
          </div>

          <div className="info-card">
            <div className="icon">
              <FontAwesomeIcon icon={faMapLocationDot} />
            </div>
            <div className="info-content">
              <p className="label">Mi dirección</p>
              <p className="value">{capitalizar(userData.direccionpaciente)}</p>
            </div>
            {renderEditButton("direccionpaciente")}
          </div>

          <div className="info-card">
            <div className="icon">
              <FontAwesomeIcon icon={faHandHoldingMedical} />
            </div>
            <div className="info-content">
              <p className="label">Mi cuidador</p>
              <p className="value">{capitalizar(userData.nombrecuidador)}</p>
            </div>
            {renderEditButton("nombrecuidador")}
          </div>

          <div className="info-card">
            <a href={`tel:${userData.telcuidador}`}>
              <div className="icon icon-button">
                <FontAwesomeIcon icon={faPhone} />
              </div>
            </a>
            <div className="info-content">
              <p className="label">Teléfono del cuidador</p>
              <p className="value">{capitalizar(userData.telcuidador)}</p>
            </div>
            {renderEditButton("telcuidador")}
          </div>
        </div>
      )}

      {editField && userData && (
        <div className="edit-modal-backdrop" role="presentation">
          <div
            className="edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
          >
            <h2 id="edit-modal-title">Editar informacion</h2>
            <p className="edit-modal-label">{editableFields[editField].label}</p>

            <div className="edit-modal-field">
              <span>Dato anterior</span>
              <p>{capitalizar(userData[editField]) || "No disponible"}</p>
            </div>

            <form onSubmit={handleSaveEdit}>
              <label htmlFor="new-info-value">
                {editableFields[editField].inputLabel}
              </label>
              <input
                id="new-info-value"
                type={editableFields[editField].type}
                value={newValue}
                onChange={(event) => setNewValue(event.target.value)}
                autoFocus
                required
              />

              {editError && (
                <p className="edit-modal-error" role="alert">
                  {editError}
                </p>
              )}

              <div className="edit-modal-actions">
                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={closeEditModal}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="save-edit-button"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
