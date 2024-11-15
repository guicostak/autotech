package com.web.AutoTech.controllers;

import com.fasterxml.uuid.Generators;
import com.web.AutoTech.controllers.dto.request.LoginRequestDTO;
import com.web.AutoTech.controllers.dto.request.RefreshTokenRequestDTO;
import com.web.AutoTech.controllers.dto.request.ResetPasswordRequestDTO;
import com.web.AutoTech.controllers.dto.response.MessageDTO;
import com.web.AutoTech.controllers.dto.response.TokenResponseDTO;
import com.web.AutoTech.infrastructure.config.security.JwtTokenProvider;
import com.web.AutoTech.services.senha.PasswordResetService;
import com.web.AutoTech.services.usuario.UsuarioServiceImpl;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.springframework.http.ResponseEntity.ok;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LogManager.getLogger(AuthController.class);

    private final HashMap<String, String> refreshTokens = new HashMap<String, String>();
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioServiceImpl usuarioServiceImpl;
    private final PasswordResetService passwordResetService;

    @PostMapping("/token")
    public ResponseEntity<?> getRefreshToken(@RequestBody @Valid RefreshTokenRequestDTO data) {
        logger.info("Recebido pedido de refresh token para o usuário: {}", data.getEmail());

        Map<Object, Object> model = new HashMap<>();
        final var username = data.getEmail();
        final var refreshToken = data.getRefreshToken();

        final var userData = usuarioServiceImpl.getUserByEmail(data.getEmail());

        if (refreshTokens.get(refreshToken) == null) {
            logger.warn("Refresh token inválido: {}", refreshToken);
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        if (refreshTokens.get(refreshToken).equals(username)) {
            logger.info("Refresh token válido para o usuário: {}", username);

            final var token = jwtTokenProvider.createToken(username,
                    this.usuarioServiceImpl.getUserByEmail(username).getAuthorities());

            model.put("token", token);
            model.put("expires", jwtTokenProvider.getExpirationDate(token));

            final var responseToken = new TokenResponseDTO(
                    token, userData.getNome(), userData.getId(), UUID.fromString(refreshToken), username, jwtTokenProvider.getExpirationDate(token));

            logger.info("Novo token JWT gerado para o usuário: {}", username);
            return ok(responseToken);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO data) {
    
        logger.info("Tentativa de login para o e-mail: {}", data.getEmail());
    
        try {
            final var userData = usuarioServiceImpl.getUserByEmail(data.getEmail());
    
            if (userData == null) {
                logger.warn("Usuário não encontrado para o e-mail: {}", data.getEmail());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email ou senha incorretos");
            }
    
            if (!userData.isEmailConfirmed()) { 
                logger.warn("Tentativa de login com e-mail não verificado: {}", data.getEmail());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Por favor, verifique seu e-mail antes de fazer login.");
            }
    
            final var name = userData.getNome();
            final var id = userData.getId();
            final var username = data.getEmail();
    
            logger.info("Autenticando usuário com e-mail: {}", username);
    
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, data.getPassword()));
    
            final var token = jwtTokenProvider.createToken(username, this.usuarioServiceImpl.getUserByEmail(username).getAuthorities());
    
            final var refreshToken = Generators.randomBasedGenerator().generate();
            refreshTokens.put(refreshToken.toString(), username);
    
            final var responseToken = new TokenResponseDTO(
                    token, name, id, refreshToken, username, jwtTokenProvider.getExpirationDate(token));
    
            logger.info("Login bem-sucedido para o usuário: {}", username);
            return ok(responseToken);
        } catch (AuthenticationException e) {
            logger.warn("Falha de autenticação para o e-mail: {}", data.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDTO("E-mail ou senha incorretos"));
        }
    }

    @PostMapping("/reset_password")
    public ResponseEntity<String> resetPassword(@RequestParam("email") String email) throws MessagingException, IOException {
        try{
            logger.info("Recebida solicitação no endpoint /reset_password" +
                    " para resetar a senha do usuario com email {}", email);

            passwordResetService.createPasswordResetTokenForUser(email);

            return ResponseEntity.status(HttpStatus.OK).body("Um e-mail com instruções para redefinir sua senha foi enviado para você.");

        } catch (RuntimeException e) {
            logger.warn("Falha ao obter usuário ao redefinir senha, email: {}", email);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/confirm_reset_password")
    public ResponseEntity<String> confirmResetPassword(
            @RequestBody @Valid ResetPasswordRequestDTO request){

        passwordResetService.resetPassword(request);

        return ResponseEntity.ok("Senha alterada com sucesso.");
    }
}
