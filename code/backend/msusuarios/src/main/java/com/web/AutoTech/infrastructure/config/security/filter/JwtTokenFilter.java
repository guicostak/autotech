package com.web.AutoTech.infrastructure.config.security.filter;

import com.web.AutoTech.exceptions.InvalidJwtAuthenticationException;
import com.web.AutoTech.infrastructure.config.security.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.io.PrintWriter;

public class JwtTokenFilter extends GenericFilterBean {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String path = request.getRequestURI();
        String httpMethod = request.getMethod(); // Obtém o método HTTP

        if (path.startsWith("/api/auth/") || (path.startsWith("/api/usuarios") && httpMethod.equals("POST"))
        || (path.startsWith("/api/usuarios/confirmacao_email")) || (path.startsWith("/api/usuarios/resend_confirmation"))) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        final var token = jwtTokenProvider.resolveToken(request);

        try {
            if (token == null) {
                throw new InvalidJwtAuthenticationException("Token JWT está ausente.");
            }

            if (!jwtTokenProvider.validateToken(token)) {
                throw new InvalidJwtAuthenticationException("Token JWT é inválido ou expirado.");
            }

            filterChain.doFilter(servletRequest, servletResponse);

        } catch (InvalidJwtAuthenticationException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            PrintWriter writer = response.getWriter();
            writer.write("{\"error\": \"" + e.getMessage() + "\"}");
            writer.flush();
        }
    }
}
