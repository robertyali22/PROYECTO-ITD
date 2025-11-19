package com.marketplace.backend.config;

import com.marketplace.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos (acceso para invitados y todos)
                        .requestMatchers(
                                "/api/usuarios/registro",
                                "/api/usuarios/verificar-email",
                                "/api/auth/login",
                                "/api/public/**" // Cualquier endpoint público adicional
                        ).permitAll()

                        // Endpoints protegidos por rol
                        // Solo ADMINISTRADOR puede acceder a /api/admin/**
                        .requestMatchers("/api/admin/**").hasRole("ADMINISTRADOR")

                        // Solo PROVEEDOR puede acceder a /api/proveedor/**
                        .requestMatchers("/api/proveedor/**").hasRole("PROVEEDOR")

                        // USUARIO, PROVEEDOR y ADMINISTRADOR pueden acceder a /api/usuario/**
                        .requestMatchers("/api/usuario/**").hasAnyRole("USUARIO", "PROVEEDOR", "ADMINISTRADOR")

                        // Cualquier otra petición requiere autenticación
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Agregar el filtro JWT antes del filtro de autenticación
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 🔥 IMPORTANTE: agregar tu dominio de Vercel
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://innovacion-snowy.vercel.app",
                "https://*.vercel.app" // ← tu frontend real
        ));

        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization")); // opcional
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
