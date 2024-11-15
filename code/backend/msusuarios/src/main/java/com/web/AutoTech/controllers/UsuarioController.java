package com.web.AutoTech.controllers;

import com.web.AutoTech.controllers.dto.request.CompleteAddressRequestDTO;
import com.web.AutoTech.controllers.dto.request.ResendEmailRequestDTO;
import com.web.AutoTech.controllers.dto.request.UsuarioCreateRequestDTO;
import com.web.AutoTech.controllers.dto.request.UsuarioUpdateRequestDTO;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.domain.enums.EmailType;
import com.web.AutoTech.exceptions.BusinessException;
import com.web.AutoTech.exceptions.InvalidJwtAuthenticationException;
import com.web.AutoTech.exceptions.ObjectNotFoundException;
import com.web.AutoTech.infrastructure.config.security.JwtTokenProvider;
import com.web.AutoTech.repositories.UsuarioDomainEntityRepository;
import com.web.AutoTech.services.autenticacao.AuthService;
import com.web.AutoTech.services.email.EmailService;
import com.web.AutoTech.services.usuario.UsuarioService;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/usuarios")
@Validated
@RequiredArgsConstructor
public class UsuarioController {

    private static final Logger logger = LogManager.getLogger(UsuarioController.class);

    private final UsuarioService usuarioService;

    private final UsuarioDomainEntityRepository usuarioDomainEntityRepository;

    private final JwtTokenProvider jwtTokenProvider;

    private final EmailService emailService;

    private final AuthService authService;

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDomainEntity> getUserById(@PathVariable @Valid final Long id, HttpServletRequest request) throws InvalidJwtAuthenticationException {
        try {
            authService.validateRequestId(request, id);

            logger.info("Recebida requisição para buscar o usuário com ID: {}", id);

            final var obj = this.usuarioService.getUserById(id);

            logger.info("Usuário com ID: {} encontrado com sucesso", id);
            return ResponseEntity.ok().body(obj);

        } catch (ObjectNotFoundException e) {
            logger.error("Erro ao buscar usuário com ID: {}. Detalhes: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            logger.error("Erro interno ao buscar usuário com ID: {}. Detalhes: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping()
    public ResponseEntity<String> createUser(@RequestBody @Valid final UsuarioCreateRequestDTO request) {
        try {
            logger.info("Recebida requisição para criar novo usuário");

            final var usuario = this.usuarioService.createUser(request);

            logger.info("Usuário criado com sucesso. ID: {}", usuario.getId());

            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (BusinessException e) {
            logger.error("Erro de negócio ao criar usuário. Detalhes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (MessagingException e) {
            logger.error("Erro de envio de mensagem ao criar usuário. Detalhes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (IOException e) {
            logger.error("Erro de entrada/saída ao criar usuário. Detalhes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/endereco/{id}")
    public ResponseEntity<Void> preencherEndereco(
            @PathVariable final Long id,
            @RequestBody final CompleteAddressRequestDTO request,
            HttpServletRequest httpRequest) {
        try {
            authService.validateRequestId(httpRequest, id);
            logger.info("Recebida requisição para completar o endereço do usuário de ID: {}", id);

            this.usuarioService.completeProfileUsuario(request, id);

            logger.info("Perfil do usuário com ID: {} completado com sucesso", id);

            return ResponseEntity.noContent().build();

        } catch (ObjectNotFoundException e) {
            logger.error("Erro ao completar o perfil do usuário com ID: {}. Usuário não encontrado.", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Erro interno ao completar o perfil do usuário com ID: {}. Detalhes: {}", id, e.getMessage(),
                    e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PatchMapping("/endereco/{id}")
    public ResponseEntity<Void> atualizarEndereco(
            @PathVariable final Long id,
            @RequestBody final CompleteAddressRequestDTO request,
            HttpServletRequest httpRequest) {
        try {
            var userId = usuarioService.getUserIdByAdress(id);
            authService.validateRequestId(httpRequest, userId);

            logger.info("Recebida requisição para atualizar o endereço do usuário de ID: {}", id);

            this.usuarioService.updateAddressUsuario(request, id);

            logger.info("Endereço do usuário com ID: {} atualizado com sucesso", id);

            return ResponseEntity.noContent().build();

        } catch (ObjectNotFoundException e) {
            logger.error("Erro ao atualizar o endereço do usuário com ID: {}. Usuário não encontrado.", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (EntityNotFoundException e) {
            logger.error("Erro ao atualizar o endereço do usuário com ID: {}. Endereço não encontrado.", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Erro interno ao atualizar o endereço do usuário com ID: {}. Detalhes: {}", id, e.getMessage(),
                    e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(
            @ModelAttribute @Valid final UsuarioUpdateRequestDTO request,
            @PathVariable final Long id,
            HttpServletRequest httpRequest) throws InvalidJwtAuthenticationException, InvalidKeyException {
        try {
            authService.validateRequestId(httpRequest, id);

            logger.info("Recebida requisição para atualizar o usuário de ID: {}", id);

            this.usuarioService.updateUser(request, id);

            logger.info("Usuário com ID: {} atualizado com sucesso", id);

            return ResponseEntity.noContent().build();

        } catch (BusinessException e) {
            logger.error("Erro de negócio ao atualizar usuário. Detalhes: {}", id);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ObjectNotFoundException e) {
            logger.error("Erro ao atualizar o usuário com ID: {}. Usuário não encontrado.", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Erro interno ao atualizar o usuário com ID: {}. Detalhes: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable @Valid final Long id, HttpServletRequest httpRequest) {
        try {
            authService.validateRequestId(httpRequest, id);
            logger.info("Recebida requisição para deletar usuário com ID: {}", id);

            this.usuarioService.deleteUser(id);

            logger.info("Usuário com ID: {} deletado com sucesso", id);

            return ResponseEntity.noContent().build();

        } catch (ObjectNotFoundException e) {
            logger.error("Erro ao deletar usuário com ID: {}. Usuário não encontrado.", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Erro interno ao deletar usuário com ID: {}. Detalhes: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/confirmacao_email/{token}")
    public ResponseEntity<String> confirmEmail(@PathVariable("token") final String token) {

        logger.info("Recebida solicitação de confirmação de email com token: {}", token);

        try {
            if (usuarioService.confirmEmail(token)) {
                logger.info("Token {} confirmado com sucesso.", token);
                return ResponseEntity.status(HttpStatus.OK).body("E-mail confirmado com sucesso.");
            } else {
                logger.warn("Erro desconhecido, Token: {}", token);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erro desconhecido ao confirmar o token");
            }
        } catch (BusinessException e) {
            logger.error("Erro ao confirmar o email para token {}: {}", token, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/resend_confirmation")
    public ResponseEntity<String> resendConfirmationEmail(@RequestBody @Valid ResendEmailRequestDTO emailRequest) {
        final var email = emailRequest.getEmail();

        logger.info("Recebida solicitação no endpoint /resend_confirmation" +
                " para reenviar confirmação de email para: {}", email);

        final var user = usuarioService.getUserByEmail(email);

        if (user == null) {
            logger.warn("E-mail não encontrado: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("E-mail não encontrado.");
        }

        final var confirmationToken = UUID.randomUUID().toString();
        usuarioDomainEntityRepository.save(user.setConfirmationToken(confirmationToken));
        logger.info("Gerado novo token de confirmação para usuário: {}", email);

        try {
            emailService.sendEmail(email, EmailType.EMAIL_CONFIRMATION.toString());
            logger.info("Novo link de confirmação enviado para o email: {}", email);
            return ResponseEntity.ok("Novo link de confirmação enviado com sucesso.");
        } catch (Exception e) {
            logger.error("Erro ao enviar novo link de confirmação para o email {}: {}", email, e.getMessage());
            return ResponseEntity.internalServerError().body("Erro ao enviar o novo link de confirmação");
        }
    }
}
