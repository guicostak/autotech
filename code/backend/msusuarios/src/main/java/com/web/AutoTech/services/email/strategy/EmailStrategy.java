package com.web.AutoTech.services.email.strategy;

import com.web.AutoTech.domain.enums.EmailType;
import jakarta.mail.MessagingException;

import java.io.IOException;

public interface EmailStrategy {

    void execute(final String email) throws MessagingException, IOException;

    EmailType applyTo();
}
