package com.msanunciospedidos.autotech.app.controller;

import com.msanunciospedidos.autotech.app.controller.dto.request.AlterarStatusAnuncioRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.request.AnuncioRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.request.GetAnunciosPorListaIdsRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.response.AnuncioResponseDTO;
import com.msanunciospedidos.autotech.app.domain.AnuncioDomainEntity;
import com.msanunciospedidos.autotech.app.domain.enums.TipoAnuncioPesquisa;
import com.msanunciospedidos.autotech.app.exception.UserNotAuthorizedException;
import com.msanunciospedidos.autotech.app.service.anuncio.AnuncioService;
import com.msanunciospedidos.autotech.app.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/anuncios")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AnuncioController {

    private static final Logger logger = LoggerFactory.getLogger(AnuncioController.class);

    private final AnuncioService anuncioService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<?> criarAnuncio(
            @RequestPart("anuncio") final AnuncioRequestDTO anuncioRequestDTO,
            @RequestPart("imagens") final List<MultipartFile> imagens, HttpServletRequest request) {
        try {
            final var userId = anuncioService.getUserByAnuncianteId(anuncioRequestDTO.getAnuncianteId(),
                    anuncioRequestDTO.getPessoaJuridica());
            authService.authenticateUser(userId, request);
            anuncioService.criarAnuncio(anuncioRequestDTO, imagens);
            logger.info("Anúncio criado com sucesso para o usuário {}", anuncioRequestDTO.getAnuncianteId());
            return ResponseEntity.status(HttpStatus.CREATED).body("Anúncio criado com sucesso!");
        } catch (RuntimeException e) {
            logger.error("Erro ao criar anúncio para o usuário {}: {}", anuncioRequestDTO.getAnuncianteId(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar anúncio");
        } catch (UserNotAuthorizedException e) {
            logger.error("Tentativa de acesso não autorizado {}",
                    e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnuncioResponseDTO> consultarAnuncio(@PathVariable final Long id) {

        try {
            final var anuncio = anuncioService.consultarAnuncio(id);
            if (anuncio == null) {
                logger.warn("Anúncio com ID {} não encontrado.", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            logger.info("Consulta realizada com sucesso para o anúncio {}", id);
            return ResponseEntity.ok(anuncio);
        } catch (Exception e) {
            logger.error("Erro ao consultar anúncio com ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<Page<AnuncioDomainEntity>> listarAnuncios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String modelo,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Double precoMin,
            @RequestParam(required = false) Double precoMax,
            @RequestParam(required = false) Integer anoFabricacao,
            @RequestParam(required = false) String valorPesquisado,
            @RequestParam(defaultValue = "dataCriacao") String campoOrdenacao,
            @RequestParam(defaultValue = "asc") String ordenacao,
            @RequestParam(required = false, defaultValue = "AMBOS") String tipoAnuncio
    ) {
        try {
            TipoAnuncioPesquisa tipoAnuncioEnum = null;
            if (tipoAnuncio != null) {
                tipoAnuncioEnum = TipoAnuncioPesquisa.valueOf(tipoAnuncio.toUpperCase());
            }

            Page<AnuncioDomainEntity> anunciosPaginados = anuncioService.listarAnunciosPaginadosComFiltros(
                    page, size, marca, modelo, categoria, precoMin, precoMax, anoFabricacao,
                    valorPesquisado, campoOrdenacao, ordenacao, tipoAnuncioEnum);

            logger.info("Listagem de anúncios realizada com sucesso. Página: {}", page);
            return ResponseEntity.ok(anunciosPaginados);

        } catch (IllegalArgumentException e) {
            logger.error("Valor inválido para tipoAnuncio: {}", tipoAnuncio, e);
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            logger.error("Erro ao listar anúncios: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> alterarStatusAnuncio(
            @RequestBody @Valid final AlterarStatusAnuncioRequestDTO alterarStatusAnuncioRequestDTO,
            @PathVariable final Long id, HttpServletRequest request
    ) {
        logger.info("Recebida solicitação para alterar o status do anúncio com ID {} para {}",
                id,
                alterarStatusAnuncioRequestDTO.getAtivo() ? "Ativo" : "Inativo");
        try {
            final var userId = anuncioService.getUserIdByAnuncioId(id);
            authService.authenticateUser(userId, request);

            anuncioService.alterarStatusAnuncio(alterarStatusAnuncioRequestDTO, id);

            logger.info("Status do anúncio com ID {} alterado com sucesso para {}",
                    id,
                    alterarStatusAnuncioRequestDTO.getAtivo() ? "Ativo" : "Inativo");

            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (IllegalStateException e) {
            logger.warn("Tentativa de alterar o status do anúncio com ID {} para {}, mas o status já era o mesmo.",
                    id,
                    alterarStatusAnuncioRequestDTO.getAtivo() ? "Ativo" : "Inativo");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (UserNotAuthorizedException e) {
            logger.error("Tentativa de acesso não autorizado {}: {}",
                    id,
                    e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            logger.error("Erro ao alterar o status do anúncio com ID {}: {}",
                    id,
                    e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/usuarios/{usuarioId}")
    public ResponseEntity<Page<AnuncioDomainEntity>> listarAnunciosPorUsuario(
            @PathVariable Long usuarioId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest httpRequest) throws UserNotAuthorizedException {
        try {
            authService.authenticateUser(usuarioId, httpRequest);
            logger.info("Listando anúncios do usuário com ID: {}", usuarioId);

            var anuncios = anuncioService.listarAnunciosPorUsuario(usuarioId, page, size);

            logger.info("Retornando {} anúncios para o usuário com ID: {}", anuncios.getTotalElements(), usuarioId);

            return ResponseEntity.ok(anuncios);
        } catch (UserNotAuthorizedException e) {
            logger.error("Tentativa de acesso não autorizado {}",
                    e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            logger.error("Erro ao alterar o status do anúncio com ID {}",
                    e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/listagem")
    public ResponseEntity<List<AnuncioDomainEntity>> listarAnunciosPorUsuario(
            @RequestBody GetAnunciosPorListaIdsRequestDTO requestDTO) {

        var anuncios = anuncioService.listarAnunciosPorListaDeIds(requestDTO.getListaids());

        return ResponseEntity.ok(anuncios);
    }

    @DeleteMapping("/{anuncioId}")
    public ResponseEntity<String> deletarAnuncio(
            @PathVariable Long anuncioId, HttpServletRequest request) {
        try {
            final var userId = anuncioService.getUserIdByAnuncioId(anuncioId);
            authService.authenticateUser(userId, request);

            logger.info("Deletando anúncio de id: {}", anuncioId);

            anuncioService.deletarAnuncio(anuncioId);

            return ResponseEntity.ok("Anúncio excluído com sucesso");
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Erro ao excluir anúncio".concat(ex.getMessage()));
        }
    }
}

