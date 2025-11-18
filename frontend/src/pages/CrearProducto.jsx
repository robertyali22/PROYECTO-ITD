import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Save, Image as ImageIcon } from 'lucide-react';
import productoService from '../services/productoService';
import categoriaService from '../services/categoriaService';

export default function CrearProducto() {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    categoriaId: '',
    subcategoriaId: '',
    nombre: '',
    descripcion: '',
    precioUnitario: '',
    unidadMedida: 'kg',
    cantidadMinima: '1',
    stockDisponible: '0',
    disponible: true,
    imagenesUrls: []
  });

  const [nuevaImagen, setNuevaImagen] = useState('');

  const unidadesMedida = [
    'kg', 'gramos', 'unidad', 'caja', 'saco', 'bolsa', 
    'litro', 'metro', 'docena', 'paquete'
  ];

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (formData.categoriaId) {
      cargarSubcategorias(formData.categoriaId);
    } else {
      setSubcategorias([]);
      setFormData(prev => ({ ...prev, subcategoriaId: '' }));
    }
  }, [formData.categoriaId]);

  const cargarCategorias = async () => {
    try {
      const data = await categoriaService.obtenerCategorias();
    setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const cargarSubcategorias = async (categoriaId) => {
    try {
      const data = await categoriaService.obtenerSubcategoriasPorCategoria(categoriaId);
    setSubcategorias(data);
    } catch (err) {
      console.error('Error al cargar subcategorías:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const agregarImagen = () => {
    if (nuevaImagen.trim()) {
      setFormData(prev => ({
        ...prev,
        imagenesUrls: [...prev.imagenesUrls, nuevaImagen.trim()]
      }));
      setNuevaImagen('');
    }
  };

  const eliminarImagen = (index) => {
    setFormData(prev => ({
      ...prev,
      imagenesUrls: prev.imagenesUrls.filter((_, i) => i !== index)
    }));
  };

  const validarFormulario = () => {
    if (!formData.categoriaId) {
      setError('Debes seleccionar una categoría');
      return false;
    }
    if (!formData.nombre.trim()) {
      setError('El nombre del producto es obligatorio');
      return false;
    }
    if (!formData.precioUnitario || parseFloat(formData.precioUnitario) <= 0) {
      setError('El precio debe ser mayor a 0');
      return false;
    }
    if (!formData.cantidadMinima || parseInt(formData.cantidadMinima) < 1) {
      setError('La cantidad mínima debe ser al menos 1');
      return false;
    }
    if (!formData.stockDisponible || parseInt(formData.stockDisponible) < 0) {
      setError('El stock no puede ser negativo');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) {
      return;
    }

    try {
      setLoading(true);

      const datosProducto = {
        categoriaId: parseInt(formData.categoriaId),
        subcategoriaId: formData.subcategoriaId ? parseInt(formData.subcategoriaId) : null,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precioUnitario: parseFloat(formData.precioUnitario),
        unidadMedida: formData.unidadMedida,
        cantidadMinima: parseInt(formData.cantidadMinima),
        stockDisponible: parseInt(formData.stockDisponible),
        disponible: formData.disponible,
        imagenesUrls: formData.imagenesUrls
      };

      const response = await productoService.crearProducto(datosProducto);

      if (response.success) {
        alert('Producto creado exitosamente');
        window.location.href = '/proveedor/productos';
      }
    } catch (err) {
      setError(err.message || 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.location.href = '/proveedor/productos'}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
          >
            <ArrowLeft size={20} />
            Volver a mis productos
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Producto</h1>
          <p className="text-gray-600 mt-1">Completa la información de tu producto</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Categorías */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategoría
              </label>
              <select
                name="subcategoriaId"
                value={formData.subcategoriaId}
                onChange={handleChange}
                disabled={!formData.categoriaId || subcategorias.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Selecciona una subcategoría</option>
                {subcategorias.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              maxLength={255}
              placeholder="Ej: Papa Blanca Premium"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              placeholder="Describe tu producto..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Precio y Unidad de Medida */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Unitario (S/) *
              </label>
              <input
                type="number"
                name="precioUnitario"
                value={formData.precioUnitario}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidad de Medida *
              </label>
              <select
                name="unidadMedida"
                value={formData.unidadMedida}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {unidadesMedida.map(unidad => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cantidad Mínima y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad Mínima *
              </label>
              <input
                type="number"
                name="cantidadMinima"
                value={formData.cantidadMinima}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Disponible *
              </label>
              <input
                type="number"
                name="stockDisponible"
                value={formData.stockDisponible}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="disponible"
              id="disponible"
              checked={formData.disponible}
              onChange={handleChange}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="disponible" className="text-sm font-medium text-gray-700">
              Producto disponible para la venta
            </label>
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imágenes del Producto
            </label>
            
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={nuevaImagen}
                onChange={(e) => setNuevaImagen(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={agregarImagen}
                disabled={!nuevaImagen.trim()}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 flex items-center gap-2"
              >
                <Plus size={20} />
                Agregar
              </button>
            </div>

            {formData.imagenesUrls.length > 0 && (
              <div className="space-y-2">
                {formData.imagenesUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <ImageIcon size={20} className="text-gray-400" />
                    <span className="flex-1 text-sm text-gray-700 truncate">{url}</span>
                    <button
                      type="button"
                      onClick={() => eliminarImagen(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => window.location.href = '/proveedor/productos'}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Crear Producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}