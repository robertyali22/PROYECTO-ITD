// src/components/Hero.jsx
import React from "react";

export default function Hero() {
  return (
    <section className="bg-linear-to-b from-white to-orange-100 py-20 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-extrabold text-orange-700 mb-6">
          Bienvenido a Faraón
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Del mercado a la puerta de tu casa, rapido y facil.
        </p>
        <button className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition transform hover:scale-105">
          Explorar productos
        </button>
      </div>
    </section>
  );
}
