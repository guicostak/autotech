package com.web.AutoTech.services.autenticacao;

import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.exceptions.InvalidJwtAuthenticationException;
import com.web.AutoTech.infrastructure.config.security.JwtTokenProvider;
import com.web.AutoTech.services.usuario.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void validateRequestId_withMatchingEmail_doesNotThrowException() throws InvalidJwtAuthenticationException {
        Long userId = 1L;
        UsuarioDomainEntity user = new UsuarioDomainEntity();
        user.setId(userId);
        user.setEmail("user@example.com");

        when(usuarioService.getUserById(userId)).thenReturn(user);
        when(jwtTokenProvider.resolveToken(request)).thenReturn("validToken");
        when(jwtTokenProvider.getUsername("validToken")).thenReturn("user@example.com");

        authService.validateRequestId(request, userId);

        verify(usuarioService, times(1)).getUserById(userId);
        verify(jwtTokenProvider, times(1)).resolveToken(request);
        verify(jwtTokenProvider, times(1)).getUsername("validToken");
    }

    @Test
    void validateRequestId_withNonMatchingEmail_throwsInvalidJwtAuthenticationException() {
        Long userId = 1L;
        UsuarioDomainEntity user = new UsuarioDomainEntity();
        user.setId(userId);
        user.setEmail("user@example.com");

        when(usuarioService.getUserById(userId)).thenReturn(user);
        when(jwtTokenProvider.resolveToken(request)).thenReturn("validToken");
        when(jwtTokenProvider.getUsername("validToken")).thenReturn("differentUser@example.com");

        assertThrows(InvalidJwtAuthenticationException.class, () -> {
            authService.validateRequestId(request, userId);
        });

        verify(usuarioService, times(1)).getUserById(userId);
        verify(jwtTokenProvider, times(1)).resolveToken(request);
        verify(jwtTokenProvider, times(1)).getUsername("validToken");
    }

    @Test
    void validateRequestId_withNullToken_throwsInvalidJwtAuthenticationException() {
        Long userId = 1L;
        UsuarioDomainEntity user = new UsuarioDomainEntity();
        user.setId(userId);
        user.setEmail("user@example.com");

        when(usuarioService.getUserById(userId)).thenReturn(user);
        when(jwtTokenProvider.resolveToken(request)).thenReturn(null);

        assertThrows(InvalidJwtAuthenticationException.class, () -> {
            authService.validateRequestId(request, userId);
        });

        verify(usuarioService, times(1)).getUserById(userId);
        verify(jwtTokenProvider, times(1)).resolveToken(request);
        verify(jwtTokenProvider, never()).getUsername(anyString());
    }
}
