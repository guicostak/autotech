package com.web.AutoTech.services.email;

import com.web.AutoTech.domain.enums.EmailType;
import com.web.AutoTech.services.email.strategy.EmailStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import jakarta.mail.MessagingException;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class EmailServiceImplTest {

    private EmailServiceImpl emailService;

    @Mock
    private EmailStrategy mockStrategy;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(mockStrategy.applyTo()).thenReturn(EmailType.RESET_PASSWORD);
        emailService = new EmailServiceImpl(List.of(mockStrategy));
    }

    @Test
    void testSendEmail_withValidStrategy() throws MessagingException, IOException {
        String email = "test@example.com";
        String emailType = "RESET_PASSWORD";

        doNothing().when(mockStrategy).execute(email);

        emailService.sendEmail(email, emailType);

        verify(mockStrategy, times(1)).execute(email);
    }

    @Test
    void testSendEmail_withNoMatchingStrategy() throws MessagingException, IOException {
        String email = "test@example.com";
        String emailType = "WELCOME";

        assertThrows(IllegalArgumentException.class, () -> {
            emailService.sendEmail(email, emailType);
        });

        verify(mockStrategy, never()).execute(anyString());
    }

    @Test
    void testSendEmail_withExceptionThrown() throws MessagingException, IOException {
        String email = "test@example.com";
        String emailType = "RESET_PASSWORD";

        doThrow(new MessagingException("Test exception")).when(mockStrategy).execute(email);

        try {
            emailService.sendEmail(email, emailType);
        } catch (RuntimeException e) {
            // Verifique se a exceção foi lançada
            assert e.getCause() instanceof MessagingException;
        }

        verify(mockStrategy, times(1)).execute(email);
    }
}