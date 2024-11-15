package com.web.AutoTech.services.email.strategy;

import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.domain.enums.EmailType;
import com.web.AutoTech.repositories.PasswordResetTokenDomainEntityRepository;
import jakarta.mail.MessagingException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;

@Component
public class EmailResetPasswordStrategy implements EmailStrategy {

    private static final String RESET_PASSWORD_LINK = "http://localhost:3000/reset_password/";

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;
    private final PasswordResetTokenDomainEntityRepository passwordResetTokenDomainEntityRepository;

    public EmailResetPasswordStrategy(JavaMailSender javaMailSender,
                                      SpringTemplateEngine templateEngine,
                                      PasswordResetTokenDomainEntityRepository passwordResetTokenDomainEntityRepository
    ) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
        this.passwordResetTokenDomainEntityRepository = passwordResetTokenDomainEntityRepository;
    }

    @Override
    public void execute(String email) throws MessagingException, IOException {

        final var message = javaMailSender.createMimeMessage();
        final var helper = new MimeMessageHelper(message, true);
        final var usuario = this.getUsuario(email);
        final var resetPasswordLink = RESET_PASSWORD_LINK + getResetPasswordToken(email);
        final var name = usuario.getNome();

        final var context = new Context();
        context.setVariable("nome", name);
        context.setVariable("resetPasswordLink", resetPasswordLink);

        final var emailContent = templateEngine.process("reset_password_email_template", context);

        helper.setTo(email);
        helper.setSubject("Autotech - Redefinir Senha");
        helper.setText(emailContent, true);

        javaMailSender.send(message);

    }

    @Override
    public EmailType applyTo() {
        return EmailType.RESET_PASSWORD;
    }

    private UsuarioDomainEntity getUsuario(final String email) {

        final var usuario = passwordResetTokenDomainEntityRepository.findByUsuarioEmail(email);

        return usuario.get().getUsuario();
    }

    private String getResetPasswordToken(final String email) {

        final var usuario = passwordResetTokenDomainEntityRepository.findByUsuarioEmail(email);

        return usuario.get().getToken();
    }
}
