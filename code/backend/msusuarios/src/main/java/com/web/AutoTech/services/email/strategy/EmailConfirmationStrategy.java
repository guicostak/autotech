package com.web.AutoTech.services.email.strategy;

import com.web.AutoTech.domain.enums.EmailType;
import com.web.AutoTech.repositories.UsuarioDomainEntityRepository;
import jakarta.mail.MessagingException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Component
public class EmailConfirmationStrategy implements EmailStrategy {

    private static final String CONFIRMATION_LINK = "http://localhost:3000/confirm/";

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;
    private final UsuarioDomainEntityRepository usuarioDomainEntityRepository;

    public EmailConfirmationStrategy(JavaMailSender javaMailSender,
                                     SpringTemplateEngine
                                             templateEngine,
                                     UsuarioDomainEntityRepository usuarioDomainEntityRepository
    ) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
        this.usuarioDomainEntityRepository = usuarioDomainEntityRepository;
    }

    @Override
    public void execute(final String email) throws MessagingException {

        final var message = javaMailSender.createMimeMessage();
        final var helper = new MimeMessageHelper(message, true);
        final var confirmationLink = CONFIRMATION_LINK + this.getConfirmationToken(email);
        final var name = this.getUsername(email);

        final var context = new Context();
        context.setVariable("nome", name);
        context.setVariable("confirmationLink", confirmationLink);

        final var emailContent = templateEngine.process("confirmation_email_template", context);

        helper.setTo(email);
        helper.setSubject("Confirmação de E-mail");
        helper.setText(emailContent, true);

        javaMailSender.send(message);
    }

    private String getConfirmationToken(final String email) {

        final var user = usuarioDomainEntityRepository.findByEmail(email);

        return user.get().getConfirmationToken();

    }

    private String getUsername(final String email) {

        final var user = usuarioDomainEntityRepository.findByEmail(email);

        if (user.isEmpty()) {
            return null;
        }

        final var name = user.get().getNome();
        final String[] nameParts = name.split(" ");

        if (nameParts.length > 0) {
            return nameParts[0];
        }

        return null;
    }

    @Override
    public EmailType applyTo() {

        return EmailType.EMAIL_CONFIRMATION;
    }
}
