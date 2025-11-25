import { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar contador al montar
  useEffect(() => {
    loadCartCount();
  }, []);

  /**
   * Cargar contador de items del carrito
   */
  const loadCartCount = async () => {
    try {
      if (!authService.isAuthenticated()) {
        setCartCount(0);
        return;
      }

      const count = await cartService.contarItems();
      setCartCount(count);
    } catch (error) {
      console.error('Error al cargar contador:', error);
      setCartCount(0);
    }
  };

  /**
   * Agregar producto al carrito
   */
  const addToCart = async (productoId, cantidad) => {
    try {
      setLoading(true);

      if (!authService.isAuthenticated()) {
        toast.error('Debes iniciar sesión para agregar productos');
        return false;
      }

      await cartService.agregarProducto({ productoId, cantidad });
      await loadCartCount();
      
      toast.success('Producto agregado al carrito');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al agregar producto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar cantidad de un item
   */
  const updateQuantity = async (carritoId, cantidad) => {
    try {
      setLoading(true);
      await cartService.actualizarCantidad(carritoId, cantidad);
      toast.success('Cantidad actualizada');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al actualizar cantidad');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar producto del carrito
   */
  const removeFromCart = async (carritoId) => {
    try {
      setLoading(true);
      await cartService.eliminarProducto(carritoId);
      await loadCartCount();
      toast.success('Producto eliminado del carrito');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al eliminar producto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vaciar carrito completo
   */
  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.vaciarCarrito();
      setCartCount(0);
      toast.success('Carrito vaciado');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al vaciar carrito');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refrescar contador
   */
  const refreshCount = async () => {
    await loadCartCount();
  };

  const value = {
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};