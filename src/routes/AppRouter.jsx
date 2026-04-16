import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPrincipal from "../pages/MenuPrincipal";
import MenuJuegos from "../pages/MenuJuegos";
import InfoPersonal from "../pages/InfoPersonal";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/MenuJuegos" element={<MenuJuegos />} />
        <Route path="/InfoPersonal" element={<InfoPersonal />} />
      </Routes>
    </BrowserRouter>
  );
}
