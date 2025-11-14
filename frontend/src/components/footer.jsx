// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-orange-700 text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Columna 1 */}
        <div>
          <h2 className="text-xl font-bold mb-3">EcoMarket</h2>
          <p className="text-sm text-orange-100">
            Tu marketplace sostenible. Compra y vende productos ecoamigables
            con impacto positivo 🌱
          </p>
        </div>

        {/* Columna 2 */}
        <div>
          <h3 className="font-semibold mb-3">Enlaces</h3>
          <ul className="space-y-2 text-orange-100">
            <li className="hover:text-white cursor-pointer">Inicio</li>
            <li className="hover:text-white cursor-pointer">Categorías</li>
            <li className="hover:text-white cursor-pointer">Tienda</li>
            <li className="hover:text-white cursor-pointer">Soporte</li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h3 className="font-semibold mb-3">Contáctanos</h3>
          <p>Email: soporte@ecomarket.com</p>
          <p>Teléfono: +51 999 999 999</p>
          <p>Lima, Perú</p>
        </div>
      </div>

      <div className="text-center mt-10 text-orange-200 text-sm">
        © 2025 EcoMarket — Todos los derechos reservados
      </div>
    </footer>
  );
}
