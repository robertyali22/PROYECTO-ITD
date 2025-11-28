package com.marketplace.backend.repository;

import com.marketplace.backend.dominio.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
    
    // Spring Data JPA es inteligente: navega de DetallePedido -> Pedido -> FechaPedido
    List<DetallePedido> findByProveedorIdOrderByPedidoFechaPedidoDesc(Long proveedorId);
}