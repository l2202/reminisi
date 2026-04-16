import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPrincipal from "../pages/MenuPrincipal";
import MenuJuegos from "../pages/MenuJuegos";
import InfoPersonal from "../pages/InfoPersonal";
import Layout from "../components/Layout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MenuPrincipal />} />
          <Route path="/MenuJuegos" element={<MenuJuegos />} />
          <Route path="/InfoPersonal" element={<InfoPersonal />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
