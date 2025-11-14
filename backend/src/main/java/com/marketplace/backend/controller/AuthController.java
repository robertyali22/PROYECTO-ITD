package com.marketplace.backend.controller;
import com.marketplace.backend.dto.LoginDTO;
import com.marketplace.backend.dto.LoginResponseDTO;
import com.marketplace.backend.dominio.Usuario;
import com.marketplace.backend.security.JwtUtil;
import com.marketplace.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    /**
     * Endpoint para login de usuarios
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) {
        try {
            // Buscar usuario por email
            Usuario usuario = usuarioService.buscarPorEmail(loginDTO.getEmail().toLowerCase().trim());
            
            // Verificar contraseña
            if (!passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Credenciales inválidas");
                return ResponseEntity.status(401).body(errorResponse);
            }
            
            // Generar token JWT
            String token = jwtUtil.generarToken(
                usuario.getEmail(),
                usuario.getId(),
                usuario.getRol().name()
            );
            
            // Crear respuesta con token y datos del usuario
            LoginResponseDTO.UsuarioInfo usuarioInfo = new LoginResponseDTO.UsuarioInfo(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getRol()
            );
            
            LoginResponseDTO loginResponse = new LoginResponseDTO(token, usuarioInfo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login exitoso");
            response.put("data", loginResponse);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Credenciales inválidas");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}
