import React from "react";
import { Wrench } from "lucide-react";

export default function VistaProducto() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Wrench size={64} className="mx-auto mb-4 text-orange-600" />
        <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
        <p className="text-lg text-gray-700 max-w-md mx-auto">
          error 404, la pagina esta en proceso de creación, espere para proximas versiones profesor, estamos trabajando en ello, robert chambea
        </p>
      </div>
    </div>
  );
}
