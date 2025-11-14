package com.marketplace.backend.controller;
import com.marketplace.backend.dto.CategoriaDTO;
import com.marketplace.backend.dto.SubcategoriaDTO;
import com.marketplace.backend.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoriaController {
    private final CategoriaService categoriaService;
    
    /**
     * Obtener todas las categorías
     * GET /api/public/categorias
     */
    @GetMapping
    public ResponseEntity<?> obtenerCategorias() {
        try {
            List<CategoriaDTO> categorias = categoriaService.obtenerTodasCategorias();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", categorias);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener categorías");
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Obtener todas las subcategorías
     * GET /api/public/categorias/subcategorias
     */
    @GetMapping("/subcategorias")
    public ResponseEntity<?> obtenerSubcategorias() {
        try {
            List<SubcategoriaDTO> subcategorias = categoriaService.obtenerTodasSubcategorias();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", subcategorias);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener subcategorías");
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Obtener subcategorías por categoría
     * GET /api/public/categorias/{categoriaId}/subcategorias
     */
    @GetMapping("/{categoriaId}/subcategorias")
    public ResponseEntity<?> obtenerSubcategoriasPorCategoria(@PathVariable Long categoriaId) {
        try {
            List<SubcategoriaDTO> subcategorias = categoriaService.obtenerSubcategoriasPorCategoria(categoriaId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", subcategorias);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener subcategorías");
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
