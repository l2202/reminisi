import BotonEmergencia from "./BotonEmergencia";

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <BotonEmergencia />
    </div>
  );
}