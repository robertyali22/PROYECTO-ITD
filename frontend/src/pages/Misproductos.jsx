import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Search,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import productoService from '../services/productoService';

export default function MisProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await productoService.obtenerMisProductos();
      
      if (response.success) {
        setProductos(response.data);
      } else {
        setError('Error al cargar productos');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (productoId, nombreProducto) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${nombreProducto}"?`)) {
      return;
    }

    try {
      const response = await productoService.eliminarProducto(productoId);
      
      if (response.success) {
        setMensaje({ 
          tipo: 'success', 
          texto: 'Producto eliminado exitosamente' 
        });
        cargarProductos(); // Recargar la lista
      }
    } catch (err) {
      setMensaje({ 
        tipo: 'error', 
        texto: err.message || 'Error al eliminar producto' 
      });
    }

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Productos
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona tu catálogo de productos
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/proveedor/productos/nuevo'}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Nuevo Producto
            </button>
          </div>

          {/* Mensajes */}
          {mensaje.texto && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${
              mensaje.tipo === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {mensaje.tipo === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
              <span>{mensaje.texto}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {busqueda ? 'No se encontraron productos' : 'No tienes productos aún'}
            </h3>
            <p className="text-gray-500 mb-6">
              {busqueda 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Comienza agregando tu primer producto'}
            </p>
            {!busqueda && (
              <button
                onClick={() => window.location.href = '/proveedor/productos/nuevo'}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Crear Primer Producto
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Imagen del producto */}
                <div className="h-48 bg-gray-200 relative">
                  {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img
                      src={producto.imagenes[0].urlImagen}
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={48} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Badge de disponibilidad */}
                  <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    producto.disponible 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {producto.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </div>

                {/* Información del producto */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
                    {producto.nombre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {producto.descripcion || 'Sin descripción'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Precio:</span>
                      <span className="font-semibold text-orange-600">
                        S/ {producto.precioUnitario.toFixed(2)} / {producto.unidadMedida}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-semibold ${
                        producto.stockDisponible > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {producto.stockDisponible} {producto.unidadMedida}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Categoría:</span>
                      <span className="text-gray-900">{producto.categoriaNombre}</span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.href = `/proveedor/productos/editar/${producto.id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(producto.id, producto.nombre)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}