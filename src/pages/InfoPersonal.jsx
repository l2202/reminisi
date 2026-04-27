import { useNavigate } from "react-router-dom";

export default function InfoPersonal() {
  const navigate = useNavigate();

  const userData = {
    nombre: "María García",
    edad: "72 años",
    direccion: "Calle Principal 123, Madrid",
    ciudad: "Madrid, España",
  };

  return (
    <div className="info-container">

      <div className="info-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Mis Datos</h1>
      </div>

      <div className="info-list">

        <div className="info-card">
          <div className="icon">👤</div>
          <div>
            <p className="label">Mi nombre</p>
            <p className="value">{userData.nombre}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="icon">📅</div>
          <div>
            <p className="label">Mi edad</p>
            <p className="value">{userData.edad}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="icon">🏠</div>
          <div>
            <p className="label">Mi dirección</p>
            <p className="value">{userData.direccion}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="icon">📍</div>
          <div>
            <p className="label">Mi ciudad</p>
            <p className="value">{userData.ciudad}</p>
          </div>
        </div>

      </div>

    </div>
  );
}