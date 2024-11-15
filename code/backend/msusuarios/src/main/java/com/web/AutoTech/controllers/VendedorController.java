package com.web.AutoTech.controllers;

import com.web.AutoTech.controllers.dto.request.CompleteAddressRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorCreateRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorUpdateRequestDTO;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.domain.VendedorDomainEntity;
import com.web.AutoTech.exceptions.BusinessException;
import com.web.AutoTech.exceptions.InvalidJwtAuthenticationException;
import com.web.AutoTech.exceptions.ObjectNotFoundException;
import com.web.AutoTech.repositories.VendedorDomainEntityRepository;
import com.web.AutoTech.services.autenticacao.AuthService;
import com.web.AutoTech.services.usuario.UsuarioServiceImpl;
import com.web.AutoTech.services.vendedor.VendedorService;
import io.jsonwebtoken.io.IOException;
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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/vendedores")
@Validated
@RequiredArgsConstructor
public class VendedorController {

    private final VendedorDomainEntityRepository vendedorDomainEntityRepository;

    private static final Logger logger = LogManager.getLogger(VendedorController.class);

    private final UsuarioServiceImpl usuarioService;

    private final VendedorService vendedorService;

    private final AuthService authService;

    @GetMapping("/{usuarioId}")
    public ResponseEntity<VendedorDomainEntity> getVendedorByUsuarioId(@PathVariable @Valid final Long usuarioId,
                                                                       HttpServletRequest request) {
        try {
            authService.validateRequestId(request, usuarioId);

            logger.info("Recebida requisição para buscar o vendedor associado ao usuário com ID: {}", usuarioId);

            final var vendedor = this.vendedorService.getVendedorByUsuarioId(usuarioId);

            if (vendedor == null) {
                logger.error("Vendedor associado ao usuário com ID: {} não encontrado.", usuarioId);
                throw new ObjectNotFoundException("Vendedor não encontrado para o usuário com ID: " + usuarioId);
            }

            logger.info("Vendedor associado ao usuário com ID: {} encontrado com sucesso.", usuarioId);
            return ResponseEntity.ok().body(vendedor);
        } catch (ObjectNotFoundException e) {
            logger.error("Erro ao buscar vendedor para o usuário com ID: {}. Detalhes: {}", usuarioId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            logger.error("Erro interno ao buscar vendedor para o usuário com ID: {}. Detalhes: {}", usuarioId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("/{usuarioId}")
    public ResponseEntity<String> createVendedor(
            @PathVariable final Long usuarioId,
            @Valid @RequestBody final VendedorCreateRequestDTO request, HttpServletRequest httpRequest) throws InvalidJwtAuthenticationException {
        try {
            authService.validateRequestId(httpRequest, usuarioId);
            logger.info("Recebida requisição para criar novo vendedor para o usuário com ID: {}", usuarioId);

            UsuarioDomainEntity usuario = usuarioService.getUserById(usuarioId);
            if (usuario == null) {
                logger.error("Usuário com ID: {} não encontrado", usuarioId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
            }

            vendedorService.createVendedor(usuario, request);

            logger.info("Vendedor criado com sucesso para o usuário com ID: {}", usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED).build();

        } catch (BusinessException e) {
            logger.error("Erro de negócio ao criar vendedor. Detalhes: {}", e.getMessage(), e);
            // Captura a exceção de negócio e retorna uma resposta com a mensagem da exceção
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IOException | MessagingException | java.io.IOException e) {
            logger.error("Erro de entrada/saída ao criar vendedor. Detalhes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (Exception e) {
            throw e;
        }
    }

    @PutMapping("/{usuarioId}")
    public ResponseEntity<String> updateVendedorByUsuarioId(@PathVariable final Long usuarioId,
                                                            @Valid @RequestBody final VendedorUpdateRequestDTO request,
                                                            HttpServletRequest httpRequest) {
        try {
            authService.validateRequestId(httpRequest, usuarioId);
            logger.info("Recebida requisição para atualizar o vendedor associado ao usuário com ID: {}", usuarioId);

            vendedorService.updateVendedor(request, usuarioId);

            logger.info("Vendedor associado ao usuário com ID: {} atualizado com sucesso.", usuarioId);
            return ResponseEntity.ok().build();

        } catch (BusinessException e) {
            logger.error("Erro de negócio ao atualizar vendedor. Detalhes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Erro interno ao atualizar o vendedor associado ao usuário com ID: {}. Detalhes: {}", usuarioId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendedor(@PathVariable @Valid final Long id) {
        try {
            logger.info("Recebida requisição para deletar vendedor com ID: {}", id);
            vendedorService.deleteVendedor(id);
            logger.info("Vendedor com ID: {} deletado com sucesso", id);
            return ResponseEntity.noContent().build();
        } catch (ObjectNotFoundException e) {
            logger.error("Erro ao deletar vendedor com ID: {}. Vendedor não encontrado.", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Erro interno ao deletar vendedor com ID: {}. Detalhes: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/endereco/{usuarioId}")
    public ResponseEntity<Void> preencherEndereco(
            @PathVariable final Long usuarioId,
            @RequestBody final CompleteAddressRequestDTO request, HttpServletRequest httpRequest) {
        try {
            authService.validateRequestId(httpRequest, usuarioId);
            logger.info("Recebida requisição para completar o endereço do vendedor associado ao usuário com ID: {}", usuarioId);

            this.vendedorService.completeProfileVendedor(request, usuarioId);

            logger.info("Perfil do vendedor associado ao usuário com ID: {} completado com sucesso", usuarioId);

            return ResponseEntity.noContent().build();

        } catch (ObjectNotFoundException e) {
            logger.error("Erro ao completar o perfil do vendedor para o usuário com ID: {}. Vendedor não encontrado.", usuarioId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Erro interno ao completar o perfil do vendedor para o usuário com ID: {}. Detalhes: {}", usuarioId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    @PatchMapping("/endereco/{usuarioId}")
    public ResponseEntity<Void> atualizarEndereco(
            @PathVariable final Long usuarioId,
            @RequestBody final CompleteAddressRequestDTO request, HttpServletRequest httpRequest) {
        try {
            authService.validateRequestId(httpRequest, usuarioId);
            logger.info("Recebida requisição para atualizar o endereço do vendedor associado ao usuário com ID: {}", usuarioId);

            this.vendedorService.updateAddressVendedor(request, usuarioId);

            logger.info("Endereço do vendedor associado ao usuário com ID: {} atualizado com sucesso", usuarioId);

            return ResponseEntity.noContent().build();

        } catch (ObjectNotFoundException e) {
            logger.error("Erro ao atualizar o endereço do vendedor para o usuário com ID: {}. Vendedor não encontrado.", usuarioId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (EntityNotFoundException e) {
            logger.error("Erro ao atualizar o endereço do vendedor para o usuário com ID: {}. Endereço não encontrado.", usuarioId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Erro interno ao atualizar o endereço do vendedor para o usuário com ID: {}. Detalhes: {}", usuarioId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

}
