export default function Register() {
  return (
    <div className="form-container">
      <h2>Crear Cuenta</h2>

      <form>
        <input type="text" placeholder="Usuario" />
        <input type="password" placeholder="Contraseña" />

        <h3>Datos del paciente</h3>

        <input type="text" placeholder="Nombre completo" />
        <input type="number" placeholder="Edad" />
        <input type="text" placeholder="Dirección" />
        <input type="text" placeholder="Teléfono" />
        <input type="text" placeholder="Contacto de emergencia" />

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}