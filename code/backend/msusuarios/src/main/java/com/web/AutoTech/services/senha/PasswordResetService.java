package com.web.AutoTech.services.senha;

import com.web.AutoTech.controllers.dto.request.ResetPasswordRequestDTO;
import jakarta.mail.MessagingException;

import java.io.IOException;

public interface PasswordResetService {

    void createPasswordResetTokenForUser(String email) throws MessagingException, IOException;
    void resetPassword(ResetPasswordRequestDTO resetPasswordRequestDTO);
}
