import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPrincipal from "../pages/MenuPrincipal";
import MenuJuegos from "../pages/MenuJuegos";
import MenuRecuerdos from "../pages/MenuRecuerdos";
import InfoPersonal from "../pages/InfoPersonal";
import Layout from "../components/Layout";
import AuthHome from "../pages/AuthHome";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import Memorama from "../games/Memorama";
import Operaciones from "../games/Operaciones";
import Sopa from "../games/Sopa";
import Patrones from "../games/Patrones";
import Logica from "../games/Logica";
import Sudoku from "../games/Sudoku";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MenuPrincipal />} />
          <Route path="/MenuJuegos" element={<MenuJuegos />} />
          <Route path="/MenuRecuerdos" element={<MenuRecuerdos />} />
          <Route path="/InfoPersonal" element={<InfoPersonal />} />
          <Route path="/auth" element={<AuthHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/memorama" element={<Memorama />} />
          <Route path="/operaciones" element={<Operaciones />} />
          <Route path="/sopaLetras" element={<Sopa />} />
          <Route path="/patrones" element={<Patrones />} />
          <Route path="/Logica" element={<Logica />} />
          <Route path="/sudoku" element={<Sudoku />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
