package com.marketplace.backend.service;

import com.marketplace.backend.dominio.*;
import com.marketplace.backend.dto.CrearPedidoDTO;
import com.marketplace.backend.repository.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final CarritoRepository carritoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Pedido crearPedido(Long usuarioId, CrearPedidoDTO dto) {
        log.info("Iniciando proceso de checkout para usuario: {}", usuarioId);

        // 1. Obtener usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Obtener items del carrito
        List<Carrito> itemsCarrito = carritoRepository.findByUsuarioIdWithAvailableProducts(usuarioId);
        
        if (itemsCarrito.isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        // --- CORRECCIÓN: CALCULAR TOTAL ANTES DE GUARDAR ---
        BigDecimal totalCalculado = BigDecimal.ZERO;
        for (Carrito item : itemsCarrito) {
            BigDecimal subtotalItem = item.getProducto().getPrecioUnitario()
                    .multiply(new BigDecimal(item.getCantidad()));
            totalCalculado = totalCalculado.add(subtotalItem);
        }

        // 3. Crear cabecera del Pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setNumeroPedido(generarNumeroPedido());
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setEstado(Pedido.EstadoPedido.pendiente); // Usar el enum que tengas (PENDIENTE o pendiente)
        pedido.setDireccionEntrega(dto.getDireccionEntrega());
        pedido.setTelefonoContacto(dto.getTelefonoContacto());
        pedido.setMetodoPago(dto.getMetodoPago() != null ? dto.getMetodoPago() : "TARJETA");
        
        // Asignamos el total calculado para pasar la validación @DecimalMin
        pedido.setTotal(totalCalculado);
        
        // Guardamos el pedido (Ahora sí pasará porque total > 0)
        pedido = pedidoRepository.save(pedido);

        // 4. Procesar items y crear DetallePedido (y actualizar stock)
        for (Carrito item : itemsCarrito) {
            Producto producto = item.getProducto();

            // Validar stock nuevamente
            if (producto.getStockDisponible() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            // Descontar Stock
            producto.setStockDisponible(producto.getStockDisponible() - item.getCantidad());
            productoRepository.save(producto);

            // Crear Detalle
            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setProveedor(producto.getProveedor());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecioUnitario());
            detalle.setSubtotal(producto.getPrecioUnitario().multiply(new BigDecimal(item.getCantidad())));
            
            detallePedidoRepository.save(detalle);
        }

        // 5. Vaciar carrito
        carritoRepository.deleteByUsuarioId(usuarioId);
        
        log.info("Pedido {} creado con éxito por un total de {}", pedido.getNumeroPedido(), totalCalculado);
        return pedido;
    }

    private String generarNumeroPedido() {
        return "PED-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    @Transactional(readOnly = true)
    public List<Pedido> obtenerPedidosUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByFechaPedidoDesc(usuarioId.intValue());
    }
}