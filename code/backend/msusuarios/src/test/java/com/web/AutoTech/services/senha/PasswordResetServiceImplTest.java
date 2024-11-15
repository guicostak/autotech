package com.web.AutoTech.services.senha;

import com.web.AutoTech.controllers.dto.request.ResetPasswordRequestDTO;
import com.web.AutoTech.domain.PasswordResetTokenDomainEntity;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.exceptions.InvalidTokenException;
import com.web.AutoTech.repositories.PasswordResetTokenDomainEntityRepository;
import com.web.AutoTech.repositories.UsuarioDomainEntityRepository;
import com.web.AutoTech.services.email.EmailService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceImplTest {

    @Mock
    private UsuarioDomainEntityRepository userRepository;

    @Mock
    private PasswordResetTokenDomainEntityRepository passwordResetTokenDomainEntityRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PasswordResetServiceImpl passwordResetService;

    private UsuarioDomainEntity usuario;

    @BeforeEach
    void setUp() {
        usuario = new UsuarioDomainEntity();
        usuario.setEmail("user@example.com");
        usuario.setPassword("oldpassword");
    }

    @Test
    void testCreatePasswordResetTokenForUser() throws MessagingException, IOException {
        // Given
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(usuario));
        when(passwordResetTokenDomainEntityRepository.findByUsuario(usuario)).thenReturn(Optional.empty());

        // When
        passwordResetService.createPasswordResetTokenForUser("user@example.com");

        // Then
        ArgumentCaptor<PasswordResetTokenDomainEntity> captor = ArgumentCaptor.forClass(PasswordResetTokenDomainEntity.class);
        verify(passwordResetTokenDomainEntityRepository).save(captor.capture());

        PasswordResetTokenDomainEntity savedToken = captor.getValue();
        assert savedToken.getToken() != null; // Verifica se o token foi gerado
        assert savedToken.getUsuario().equals(usuario); // Verifica se o token está associado ao usuário
        assert savedToken.getExpirationDate().isAfter(LocalDateTime.now()); // Verifica se o token tem uma data de expiração futura

        verify(emailService).sendEmail(usuario.getEmail(), "RESET_PASSWORD");
    }

    @Test
    void testValidateToken_withValidToken() {
        // Given
        String validToken = UUID.randomUUID().toString();
        PasswordResetTokenDomainEntity tokenEntity = new PasswordResetTokenDomainEntity();
        tokenEntity.setToken(validToken);
        tokenEntity.setExpirationDate(LocalDateTime.now().plusHours(1));
        when(passwordResetTokenDomainEntityRepository.findByToken(validToken)).thenReturn(Optional.of(tokenEntity));

        // When
        boolean isValid = passwordResetService.validateToken(validToken);

        // Then
        assert isValid;
    }

    @Test
    void testValidateToken_withExpiredToken() {
        // Given
        String expiredToken = UUID.randomUUID().toString();
        PasswordResetTokenDomainEntity tokenEntity = new PasswordResetTokenDomainEntity();
        tokenEntity.setToken(expiredToken);
        tokenEntity.setExpirationDate(LocalDateTime.now().minusHours(1));
        when(passwordResetTokenDomainEntityRepository.findByToken(expiredToken)).thenReturn(Optional.of(tokenEntity));

        // When / Then
        try {
            passwordResetService.validateToken(expiredToken);
        } catch (InvalidTokenException e) {
            assert e.getMessage().equals("Link para recuperação inválido");
        }
    }

    @Test
    void testResetPassword_withInvalidToken() {
        // Given
        ResetPasswordRequestDTO requestDTO = new ResetPasswordRequestDTO();
        requestDTO.setToken(UUID.randomUUID().toString());
        requestDTO.setNovaSenha("newpassword");

        // When / Then
        try {
            passwordResetService.resetPassword(requestDTO);
        } catch (InvalidTokenException e) {
            assert e.getMessage().equals("Link para recuperação inválido");
        }
    }

    @Test
    void testResetPassword_withValidToken() {
        String validToken = UUID.randomUUID().toString();
        PasswordResetTokenDomainEntity tokenEntity = new PasswordResetTokenDomainEntity();
        tokenEntity.setToken(validToken);
        tokenEntity.setExpirationDate(LocalDateTime.now().plusHours(1));
        tokenEntity.setUsuario(usuario);

        when(passwordResetTokenDomainEntityRepository.findByToken(validToken)).thenReturn(Optional.of(tokenEntity));

        BCryptPasswordEncoder passwordEncoder = mock(BCryptPasswordEncoder.class);

        ResetPasswordRequestDTO requestDTO = new ResetPasswordRequestDTO();
        requestDTO.setToken(validToken);
        requestDTO.setNovaSenha("newpassword");

        passwordResetService.resetPassword(requestDTO);

        verify(userRepository).save(usuario);
        verify(passwordResetTokenDomainEntityRepository).delete(tokenEntity);
    }

    @Test
    void testResetPassword_withSamePassword() {
        String validToken = UUID.randomUUID().toString();
        PasswordResetTokenDomainEntity tokenEntity = new PasswordResetTokenDomainEntity();
        tokenEntity.setToken(validToken);
        tokenEntity.setExpirationDate(LocalDateTime.now().plusHours(1));
        tokenEntity.setUsuario(usuario);

        when(passwordResetTokenDomainEntityRepository.findByToken(validToken)).thenReturn(Optional.of(tokenEntity));

        BCryptPasswordEncoder passwordEncoder = mock(BCryptPasswordEncoder.class);

        ResetPasswordRequestDTO requestDTO = new ResetPasswordRequestDTO();
        requestDTO.setToken(validToken);
        requestDTO.setNovaSenha("oldpassword");

        try {
            passwordResetService.resetPassword(requestDTO);
        } catch (IllegalArgumentException e) {
            assert e.getMessage().equals("A nova senha não pode ser igual à senha atual.");
        }
    }
}

