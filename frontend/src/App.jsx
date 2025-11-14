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
          // Configuración predeterminada
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            padding: '16px',
            borderRadius: '8px',
          },
          // Estilos personalizados por tipo
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
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/Miperfil" element={<Miperfil />} />
        <Route path="/Administrativa" element={<Administrativa />} />
        <Route path="/Carrito" element={<Carrito />} />
        <Route path="/Contacto" element={<Contacto />} />
        <Route path="/Mispedidos" element={<Mispedidos />} />
        <Route path="/vista_producto" element={<VistaProducto />} />
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
