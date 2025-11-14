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
import LoginModal from "./components/LoginModal";
import RegistroModal from "./components/RegistroModal";
import reportesP from "./pages/reportesP";
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
        {/* Rutas públicas - accesibles para todos (incluido invitado) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute pagina="home">
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/catalogo" 
          element={
            <ProtectedRoute pagina="catalogo">
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
            <ProtectedRoute pagina="carrito">
              <Carrito />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vista_producto" 
          element={
            <ProtectedRoute pagina="catalogo">
              <VistaProducto />
            </ProtectedRoute>
          } 
        />

        {/* Rutas protegidas - requieren login (usuario, proveedor, administrador) */}
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

        {/* Ruta exclusiva para PROVEEDOR */}
        <Route 
          path="/reportesP" 
          element={
            <ProtectedRoute pagina="reportesP">
              <reportesP />
            </ProtectedRoute>
          } 
        />

        {/* Ruta exclusiva para ADMINISTRADOR */}
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
