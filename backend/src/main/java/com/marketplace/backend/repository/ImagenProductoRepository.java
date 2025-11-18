package com.marketplace.backend.repository;

import com.marketplace.backend.dominio.ImagenProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagenProductoRepository extends JpaRepository<ImagenProducto, Long> {
    
    // Buscar imágenes por producto
    List<ImagenProducto> findByProductoId(Long productoId);
    
    // Eliminar todas las imágenes de un producto
    void deleteByProductoId(Long productoId);
    
    // Contar imágenes de un producto
    Long countByProductoId(Long productoId);
}