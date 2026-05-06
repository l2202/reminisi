export default function BotonEmergencia() {
  const numeroEmergencia = "911";
  return (
    <a href={`tel:${numeroEmergencia}`} className="emergencia">📞</a>
    //prueba
  );
}