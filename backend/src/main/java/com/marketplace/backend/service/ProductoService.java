package com.marketplace.backend.service;

import com.marketplace.backend.dominio.*;
import com.marketplace.backend.dto.*;
import com.marketplace.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductoService {
    
    private final ProductoRepository productoRepository;
    private final ImagenProductoRepository imagenProductoRepository;
    private final ProveedorRepository proveedorRepository;
    private final CategoriaRepository categoriaRepository;
    private final SubcategoriaRepository subcategoriaRepository;
    
    /**
     * Crear producto (solo proveedor)
     */
    @Transactional
    public ProductoDTO crearProducto(Long usuarioId, CrearProductoDTO dto) {
        log.info("Creando producto para usuario: {}", usuarioId);
        
        // Verificar que el usuario sea proveedor aprobado
        Proveedor proveedor = proveedorRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("No eres un proveedor"));
        
        if (proveedor.getEstado() != Proveedor.EstadoProveedor.APROBADO) {
            throw new RuntimeException("Tu cuenta de proveedor no está aprobada");
        }
        
        // Validar categoría
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        // Validar subcategoría si existe
        Subcategoria subcategoria = null;
        if (dto.getSubcategoriaId() != null) {
            subcategoria = subcategoriaRepository.findById(dto.getSubcategoriaId())
                    .orElseThrow(() -> new RuntimeException("Subcategoría no encontrada"));
        }
        
        // Crear producto
        Producto producto = new Producto();
        producto.setProveedor(proveedor);
        producto.setCategoria(categoria);
        producto.setSubcategoria(subcategoria);
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecioUnitario(dto.getPrecioUnitario());
        producto.setUnidadMedida(dto.getUnidadMedida());
        producto.setCantidadMinima(dto.getCantidadMinima());
        producto.setStockDisponible(dto.getStockDisponible());
        producto.setDisponible(dto.getDisponible() != null ? dto.getDisponible() : true);
        
        Producto productoGuardado = productoRepository.save(producto);
        log.info("Producto creado con ID: {}", productoGuardado.getId());
        
        // Guardar imágenes si existen
        if (dto.getImagenesUrls() != null && !dto.getImagenesUrls().isEmpty()) {
            for (String url : dto.getImagenesUrls()) {
                ImagenProducto imagen = new ImagenProducto();
                imagen.setProducto(productoGuardado);
                imagen.setUrlImagen(url);
                imagenProductoRepository.save(imagen);
            }
            log.info("Se guardaron {} imágenes para el producto", dto.getImagenesUrls().size());
        }
        
        return convertirADTO(productoGuardado);
    }
    
    /**
     * Obtener mis productos (proveedor)
     */
    @Transactional(readOnly = true)
    public List<ProductoDTO> obtenerMisProductos(Long usuarioId) {
        log.info("Obteniendo productos del usuario: {}", usuarioId);
        
        Proveedor proveedor = proveedorRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("No eres un proveedor"));
        
        return productoRepository.findByProveedorId(proveedor.getId())
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener producto específico del proveedor
     */
    @Transactional(readOnly = true)
    public ProductoDTO obtenerMiProducto(Long usuarioId, Long productoId) {
        log.info("Obteniendo producto {} del usuario {}", productoId, usuarioId);
        
        Proveedor proveedor = proveedorRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("No eres un proveedor"));
        
        Producto producto = productoRepository.findByIdAndProveedorId(productoId, proveedor.getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado o no te pertenece"));
        
        return convertirADTO(producto);
    }
    
    /**
     * Actualizar producto (proveedor)
     */
    @Transactional
    public ProductoDTO actualizarProducto(Long usuarioId, Long productoId, ActualizarProductoDTO dto) {
        log.info("Actualizando producto {} del usuario {}", productoId, usuarioId);
        
        Proveedor proveedor = proveedorRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("No eres un proveedor"));
        
        Producto producto = productoRepository.findByIdAndProveedorId(productoId, proveedor.getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado o no te pertenece"));
        
        // Actualizar campos si no son null
        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoria(categoria);
        }
        
        if (dto.getSubcategoriaId() != null) {
            Subcategoria subcategoria = subcategoriaRepository.findById(dto.getSubcategoriaId())
                    .orElseThrow(() -> new RuntimeException("Subcategoría no encontrada"));
            producto.setSubcategoria(subcategoria);
        }
        
        if (dto.getNombre() != null) producto.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) producto.setDescripcion(dto.getDescripcion());
        if (dto.getPrecioUnitario() != null) producto.setPrecioUnitario(dto.getPrecioUnitario());
        if (dto.getUnidadMedida() != null) producto.setUnidadMedida(dto.getUnidadMedida());
        if (dto.getCantidadMinima() != null) producto.setCantidadMinima(dto.getCantidadMinima());
        if (dto.getStockDisponible() != null) producto.setStockDisponible(dto.getStockDisponible());
        if (dto.getDisponible() != null) producto.setDisponible(dto.getDisponible());
        
        Producto actualizado = productoRepository.save(producto);
        log.info("Producto {} actualizado exitosamente", productoId);
        
        return convertirADTO(actualizado);
    }
    
    /**
     * Eliminar producto (proveedor)
     */
    @Transactional
    public void eliminarProducto(Long usuarioId, Long productoId) {
        log.info("Eliminando producto {} del usuario {}", productoId, usuarioId);
        
        Proveedor proveedor = proveedorRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("No eres un proveedor"));
        
        Producto producto = productoRepository.findByIdAndProveedorId(productoId, proveedor.getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado o no te pertenece"));
        
        // Eliminar imágenes primero
        imagenProductoRepository.deleteByProductoId(productoId);
        
        // Eliminar producto
        productoRepository.delete(producto);
        
        log.info("Producto {} eliminado exitosamente", productoId);
    }
    
    /**
     * Agregar imagen a producto
     */
    @Transactional
    public ImagenProductoDTO agregarImagen(Long usuarioId, Long productoId, String urlImagen) {
        log.info("Agregando imagen al producto {} del usuario {}", productoId, usuarioId);
        
        Proveedor proveedor = proveedorRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("No eres un proveedor"));
        
        Producto producto = productoRepository.findByIdAndProveedorId(productoId, proveedor.getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado o no te pertenece"));
        
        ImagenProducto imagen = new ImagenProducto();
        imagen.setProducto(producto);
        imagen.setUrlImagen(urlImagen);
        
        ImagenProducto guardada = imagenProductoRepository.save(imagen);
        log.info("Imagen agregada con ID: {}", guardada.getId());
        
        return convertirAImagenDTO(guardada);
    }
    
    /**
     * Eliminar imagen de producto
     */
    @Transactional
    public void eliminarImagen(Long usuarioId, Long productoId, Long imagenId) {
        log.info("Eliminando imagen {} del producto {} del usuario {}", imagenId, productoId, usuarioId);
        
        Proveedor proveedor = proveedorRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("No eres un proveedor"));
        
        // Verificar que el producto pertenece al proveedor
        productoRepository.findByIdAndProveedorId(productoId, proveedor.getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado o no te pertenece"));
        
        // Buscar y eliminar imagen
        ImagenProducto imagen = imagenProductoRepository.findById(imagenId)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
        
        if (!imagen.getProducto().getId().equals(productoId)) {
            throw new RuntimeException("La imagen no pertenece a este producto");
        }
        
        imagenProductoRepository.delete(imagen);
        log.info("Imagen {} eliminada exitosamente", imagenId);
    }
    
    /**
     * Obtener todos los productos (público)
     */
    @Transactional(readOnly = true)
    public List<ProductoDTO> obtenerTodosLosProductos() {
        return productoRepository.findByDisponibleTrue()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener productos por categoría (público)
     */
    @Transactional(readOnly = true)
    public List<ProductoDTO> obtenerProductosPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId)
                .stream()
                .filter(Producto::getDisponible)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convertir Producto a DTO
     */
    private ProductoDTO convertirADTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setProveedorId(producto.getProveedor().getId());
        dto.setNombreEmpresa(producto.getProveedor().getNombreEmpresa());
        dto.setCategoriaId(producto.getCategoria().getId());
        dto.setCategoriaNombre(producto.getCategoria().getNombre());
        
        if (producto.getSubcategoria() != null) {
            dto.setSubcategoriaId(producto.getSubcategoria().getId());
            dto.setSubcategoriaNombre(producto.getSubcategoria().getNombre());
        }
        
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecioUnitario(producto.getPrecioUnitario());
        dto.setUnidadMedida(producto.getUnidadMedida());
        dto.setCantidadMinima(producto.getCantidadMinima());
        dto.setStockDisponible(producto.getStockDisponible());
        dto.setDisponible(producto.getDisponible());
        dto.setFechaPublicacion(producto.getFechaPublicacion());
        dto.setCalificacionPromedio(producto.getCalificacionPromedio());
        
        // Obtener imágenes
        List<ImagenProductoDTO> imagenes = imagenProductoRepository.findByProductoId(producto.getId())
                .stream()
                .map(this::convertirAImagenDTO)
                .collect(Collectors.toList());
        dto.setImagenes(imagenes);
        
        return dto;
    }
    
    /**
     * Convertir ImagenProducto a DTO
     */
    private ImagenProductoDTO convertirAImagenDTO(ImagenProducto imagen) {
        ImagenProductoDTO dto = new ImagenProductoDTO();
        dto.setId(imagen.getId());
        dto.setProductoId(imagen.getProducto().getId());
        dto.setUrlImagen(imagen.getUrlImagen());
        return dto;
    }
}