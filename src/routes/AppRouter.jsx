import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPrincipal from "../pages/MenuPrincipal";
import MenuJuegos from "../pages/MenuJuegos";
import InfoPersonal from "../pages/InfoPersonal";
import Layout from "../components/Layout";
import AuthHome from "../pages/AuthHome";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Memorama from "../games/Memorama";
import Operaciones from "../games/Operaciones";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MenuPrincipal />} />
          <Route path="/MenuJuegos" element={<MenuJuegos />} />
          <Route path="/InfoPersonal" element={<InfoPersonal />} />
          <Route path="/auth" element={<AuthHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/memorama" element={<Memorama />} />
          <Route path="/operaciones" element={<Operaciones />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
