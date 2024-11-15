package com.web.AutoTech.services.senha;

import com.web.AutoTech.controllers.dto.request.ResetPasswordRequestDTO;
import com.web.AutoTech.domain.PasswordResetTokenDomainEntity;
import com.web.AutoTech.domain.enums.EmailType;
import com.web.AutoTech.exceptions.InvalidTokenException;
import com.web.AutoTech.repositories.PasswordResetTokenDomainEntityRepository;
import com.web.AutoTech.repositories.UsuarioDomainEntityRepository;
import com.web.AutoTech.services.email.EmailService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    private static final Integer EXPIRATION_TIME = 1;

    private final UsuarioDomainEntityRepository userRepository;

    private final PasswordResetTokenDomainEntityRepository passwordResetTokenDomainEntityRepository;

    private final EmailService emailService;

    public PasswordResetServiceImpl(UsuarioDomainEntityRepository userRepository,
                                    PasswordResetTokenDomainEntityRepository passwordResetTokenDomainEntityRepository,
                                    EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.passwordResetTokenDomainEntityRepository = passwordResetTokenDomainEntityRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public void createPasswordResetTokenForUser(String email) throws MessagingException, IOException {

        final var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        final var token = UUID.randomUUID().toString();;
        final var resetToken = new PasswordResetTokenDomainEntity()
                .setToken(token)
                .setUsuario(user)
                .setExpirationDate(LocalDateTime.now().plusHours(EXPIRATION_TIME));

        passwordResetTokenDomainEntityRepository.findByUsuario(user)
                .ifPresentOrElse(existingToken -> {
                    resetToken.setId(existingToken.getId());
                    passwordResetTokenDomainEntityRepository.save(resetToken);
                }, () -> passwordResetTokenDomainEntityRepository.save(resetToken));

        emailService.sendEmail(user.getEmail(), EmailType.RESET_PASSWORD.name());
    }

    public boolean validateToken(String token) {
        final var resetToken = passwordResetTokenDomainEntityRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Link para recuperação inválido"));

        return !resetToken.getExpirationDate().isBefore(LocalDateTime.now());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequestDTO resetPasswordRequestDTO) {

        final var token = resetPasswordRequestDTO.getToken();
        final var newPassword = resetPasswordRequestDTO.getNovaSenha();

        if (!validateToken(token)) {
            throw new InvalidTokenException("Link para recuperação expirado");
        }

        final var resetToken = passwordResetTokenDomainEntityRepository.findByToken(token).get();
        final var user = resetToken.getUsuario();

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("A nova senha não pode ser igual à senha atual.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
        passwordResetTokenDomainEntityRepository.delete(resetToken);
    }
}

