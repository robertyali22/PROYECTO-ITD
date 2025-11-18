import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import productoService from '../services/productoService';
import categoriaService from '../services/categoriaService';

export default function EditarProducto() {
  const { id } = useParams(); // Obtener ID del producto de la URL
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [error, setError] = useState('');
  const [producto, setProducto] = useState(null);
  
  const [formData, setFormData] = useState({
    categoriaId: '',
    subcategoriaId: '',
    nombre: '',
    descripcion: '',
    precioUnitario: '',
    unidadMedida: 'kg',
    cantidadMinima: '1',
    stockDisponible: '0',
    disponible: true
  });

  const [imagenes, setImagenes] = useState([]);
  const [nuevaImagen, setNuevaImagen] = useState('');

  const unidadesMedida = [
    'kg', 'gramos', 'unidad', 'caja', 'saco', 'bolsa', 
    'litro', 'metro', 'docena', 'paquete'
  ];

  useEffect(() => {
    cargarCategorias();
    cargarProducto();
  }, [id]);

  useEffect(() => {
    if (formData.categoriaId) {
      cargarSubcategorias(formData.categoriaId);
    } else {
      setSubcategorias([]);
    }
  }, [formData.categoriaId]);

  const cargarCategorias = async () => {
    try {
      const response = await categoriaService.obtenerCategorias();
      if (response.success) {
        setCategorias(response.data);
      }
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const cargarSubcategorias = async (categoriaId) => {
    try {
      const response = await categoriaService.obtenerSubcategoriasPorCategoria(categoriaId);
      if (response.success) {
        setSubcategorias(response.data);
      }
    } catch (err) {
      console.error('Error al cargar subcategorías:', err);
    }
  };

  const cargarProducto = async () => {
    try {
      setLoading(true);
      const response = await productoService.obtenerProductoPorId(id);
      
      if (response.success) {
        const prod = response.data;
        setProducto(prod);
        setImagenes(prod.imagenes || []);
        
        setFormData({
          categoriaId: prod.categoriaId.toString(),
          subcategoriaId: prod.subcategoriaId ? prod.subcategoriaId.toString() : '',
          nombre: prod.nombre,
          descripcion: prod.descripcion || '',
          precioUnitario: prod.precioUnitario.toString(),
          unidadMedida: prod.unidadMedida,
          cantidadMinima: prod.cantidadMinima.toString(),
          stockDisponible: prod.stockDisponible.toString(),
          disponible: prod.disponible
        });
      }
    } catch (err) {
      setError(err.message || 'Error al cargar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const agregarImagen = async () => {
    if (!nuevaImagen.trim()) return;

    try {
      const response = await productoService.agregarImagen(id, nuevaImagen.trim());
      
      if (response.success) {
        setImagenes(prev => [...prev, response.data]);
        setNuevaImagen('');
      }
    } catch (err) {
      alert(err.message || 'Error al agregar imagen');
    }
  };

  const eliminarImagen = async (imagenId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta imagen?')) {
      return;
    }

    try {
      const response = await productoService.eliminarImagen(id, imagenId);
      
      if (response.success) {
        setImagenes(prev => prev.filter(img => img.id !== imagenId));
      }
    } catch (err) {
      alert(err.message || 'Error al eliminar imagen');
    }
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
      setGuardando(true);

      const datosActualizados = {
        categoriaId: parseInt(formData.categoriaId),
        subcategoriaId: formData.subcategoriaId ? parseInt(formData.subcategoriaId) : null,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precioUnitario: parseFloat(formData.precioUnitario),
        unidadMedida: formData.unidadMedida,
        cantidadMinima: parseInt(formData.cantidadMinima),
        stockDisponible: parseInt(formData.stockDisponible),
        disponible: formData.disponible
      };

      const response = await productoService.actualizarProducto(id, datosActualizados);

      if (response.success) {
        alert('Producto actualizado exitosamente');
        window.location.href = '/proveedor/productos';
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar producto');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Producto no encontrado</p>
          <button
            onClick={() => window.location.href = '/proveedor/productos'}
            className="mt-4 text-orange-600 hover:text-orange-700"
          >
            Volver a mis productos
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
          <p className="text-gray-600 mt-1">Actualiza la información de tu producto</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Básica</h2>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Precio y Unidad */}
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

            {/* Cantidades */}
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
          </div>

          {/* Imágenes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Imágenes</h2>
            
            {/* Agregar nueva imagen */}
            <div className="flex gap-2 mb-4">
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

            {/* Lista de imágenes */}
            {imagenes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagenes.map((imagen) => (
                  <div key={imagen.id} className="relative group">
                    <img
                      src={imagen.urlImagen}
                      alt="Producto"
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Error';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => eliminarImagen(imagen.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon size={48} className="mx-auto mb-2 text-gray-400" />
                <p>No hay imágenes agregadas</p>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.location.href = '/proveedor/productos'}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {guardando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}