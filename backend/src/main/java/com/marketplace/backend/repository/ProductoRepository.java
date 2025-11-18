package com.marketplace.backend.repository;

import com.marketplace.backend.dominio.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // Buscar productos por proveedor
    List<Producto> findByProveedorId(Long proveedorId);
    
    // Buscar productos por categoría
    List<Producto> findByCategoriaId(Long categoriaId);
    
    // Buscar productos por subcategoría
    List<Producto> findBySubcategoriaId(Long subcategoriaId);
    
    // Buscar productos disponibles
    List<Producto> findByDisponibleTrue();
    
    // Buscar productos por proveedor y disponibilidad
    List<Producto> findByProveedorIdAndDisponibleTrue(Long proveedorId);
    
    // Buscar producto específico de un proveedor
    Optional<Producto> findByIdAndProveedorId(Long productoId, Long proveedorId);
    
    // Buscar por nombre (búsqueda parcial)
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    
    // Contar productos de un proveedor
    Long countByProveedorId(Long proveedorId);
}