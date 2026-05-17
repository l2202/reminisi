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
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

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
              <p className="label">Mi profesion</p>
              <p className="value">{capitalizar(userData.profesionpaciente)}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="icon">
              <FontAwesomeIcon icon={faMapLocationDot} />
            </div>
            <div className="info-content">
              <p className="label">Mi direccion</p>
              <p className="value">{capitalizar(userData.direccionpaciente)}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="icon">
              <FontAwesomeIcon icon={faHandHoldingMedical} />
            </div>
            <div className="info-content">
              <p className="label">Mi cuidador</p>
              <p className="value">{capitalizar(userData.nombrecuidador)}</p>
            </div>
          </div>

          <div className="info-card">
            <a href={`tel:${userData.telcuidador}`}>
              <div className="icon icon-button">
                <FontAwesomeIcon icon={faPhone} />
              </div>
            </a>
            <div className="info-content">
              <p className="label">Telefono del cuidador</p>
              <p className="value">{capitalizar(userData.telcuidador)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
