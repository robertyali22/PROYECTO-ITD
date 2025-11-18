import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Miperfil from "./pages/Miperfil";
import Administrativa from "./pages/Administrativa";
import Carrito from "./pages/Carrito";
import Contacto from "./pages/Contacto";
import Mispedidos from "./pages/Mispedidos";
import VistaProducto from "./pages/vista_producto";
import SolicitarProveedor from "./pages/SolicitarProveedor";
import ReportesP from "./pages/reportesP";
import MisProductos from "./pages/Misproductos";
import CrearProducto from "./pages/CrearProducto";
import EditarProducto from "./pages/EditarProducto";
import LoginModal from "./components/LoginModal";
import RegistroModal from "./components/RegistroModal";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Configuración de notificaciones toast */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegistro(true)}
      />

      <Routes>
        {/* ========== RUTAS PÚBLICAS ========== */}
        {/* Accesibles para todos (incluido invitado) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute pagina="home">
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Catalogo" 
          element={
            <ProtectedRoute pagina="Catalogo">
              <Catalogo />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Contacto" 
          element={
            <ProtectedRoute pagina="contacto">
              <Contacto />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Carrito" 
          element={
            <ProtectedRoute pagina="Carrito">
              <Carrito />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vista_producto" 
          element={
            <ProtectedRoute pagina="VistaProducto">
              <VistaProducto />
            </ProtectedRoute>
          } 
        />

        {/* ========== RUTAS PROTEGIDAS ========== */}
        {/* Requieren login (usuario, proveedor, administrador) */}
        <Route 
          path="/Miperfil" 
          element={
            <ProtectedRoute pagina="miperfil">
              <Miperfil />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Mispedidos" 
          element={
            <ProtectedRoute pagina="mispedidos">
              <Mispedidos />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta para solicitar ser proveedor - requiere login */}
        <Route 
          path="/solicitar-proveedor" 
          element={
            <ProtectedRoute pagina="solicitarproveedor">
              <SolicitarProveedor />
            </ProtectedRoute>
          } 
        />

        {/* ========== RUTAS EXCLUSIVAS PARA PROVEEDOR ========== */}
        {/* Solo accesibles para usuarios con rol 'proveedor' */}
        
        {/* Reportes del proveedor */}
        <Route 
          path="/ReportesP" 
          element={
            <ProtectedRoute pagina="ReportesP">
              <ReportesP />
            </ProtectedRoute>
          } 
        />

        {/* Gestión de productos */}
        <Route 
          path="/proveedor/productos" 
          element={
            <ProtectedRoute pagina="misproductos">
              <MisProductos />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/proveedor/productos/nuevo" 
          element={
            <ProtectedRoute pagina="crearproducto">
              <CrearProducto />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/proveedor/productos/editar/:id" 
          element={
            <ProtectedRoute pagina="editarproducto">
              <EditarProducto />
            </ProtectedRoute>
          } 
        />

        {/* ========== RUTAS EXCLUSIVAS PARA ADMINISTRADOR ========== */}
        {/* Solo accesibles para usuarios con rol 'administrador' */}
        <Route 
          path="/Administrativa" 
          element={
            <ProtectedRoute pagina="administrativa">
              <Administrativa />
            </ProtectedRoute>
          } 
        />
      </Routes>

      <Footer />

      {/* Modales */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <RegistroModal
        isOpen={showRegistro}
        onClose={() => setShowRegistro(false)}
      />
    </div>
  );
}

export default App;