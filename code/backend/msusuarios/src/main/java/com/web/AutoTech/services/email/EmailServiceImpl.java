package com.web.AutoTech.services.email;

import com.web.AutoTech.domain.enums.EmailType;
import com.web.AutoTech.services.email.strategy.EmailStrategy;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class EmailServiceImpl implements EmailService {

    private final List<EmailStrategy> strategies;

    public EmailServiceImpl(List<EmailStrategy> strategies) {
        this.strategies = strategies;
    }

    @Override
    public void sendEmail(final String email, final String emailType) {

        strategies
                .stream()
                .filter(strategy -> strategy.applyTo().equals(EmailType.valueOf(emailType)))
                .findFirst()
                .ifPresent(strategy -> {
                    try {
                        strategy.execute(email);
                    } catch (MessagingException | IOException e) {
                        throw new RuntimeException(e);
                    }
                });
    }
}