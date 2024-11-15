package com.web.AutoTech.services.autenticacao;

import com.web.AutoTech.exceptions.InvalidJwtAuthenticationException;
import com.web.AutoTech.infrastructure.config.security.JwtTokenProvider;
import com.web.AutoTech.services.usuario.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioService usuarioService;
    private final JwtTokenProvider jwtTokenProvider;

    public void validateRequestId(HttpServletRequest request, Long userId) throws InvalidJwtAuthenticationException {
        final var user = usuarioService.getUserById(userId);
        final var token = jwtTokenProvider.resolveToken(request);

        if (token == null) {
            throw new InvalidJwtAuthenticationException("Token de autenticação não encontrado.");
        }

        final var usernameToken = jwtTokenProvider.getUsername(token);

        if (!usernameToken.equals(user.getEmail())) {
            throw new InvalidJwtAuthenticationException("Erro de autorização de Usuário");
        }
    }

}
