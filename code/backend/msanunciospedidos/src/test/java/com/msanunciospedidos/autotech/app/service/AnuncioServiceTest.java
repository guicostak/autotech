package com.msanunciospedidos.autotech.app.service;

import com.msanunciospedidos.autotech.app.controller.dto.request.AnuncioRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.response.AnuncioResponseDTO;
import com.msanunciospedidos.autotech.app.domain.AnuncioDomainEntity;
import com.msanunciospedidos.autotech.app.domain.enums.TipoAnuncioPesquisa;
import com.msanunciospedidos.autotech.app.repository.AnuncioRepository;
import com.msanunciospedidos.autotech.app.service.anuncio.AnuncioService;
import com.msanunciospedidos.autotech.app.service.aws.S3Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AnuncioServiceTest {

    @InjectMocks
    private AnuncioService anuncioService;

    @Mock
    private AnuncioRepository anuncioRepository;

    @Mock
    private S3Service s3Service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void criarAnuncio_deveSalvarAnuncioComSucesso() throws IOException {
        // Mock do request DTO
        final var anuncioRequestDTO = new AnuncioRequestDTO(); // Popule os campos conforme necessário
        anuncioRequestDTO.setTitulo("Teste");

        // Mock da entidade de anúncio
        final var anuncioEntity = new AnuncioDomainEntity();
        anuncioEntity.setId(1L);

        // Mock da lista de imagens
        final var imagens = List.of(mock(MultipartFile.class));

        // Mock do comportamento do repositório
        when(anuncioRepository.save(any(AnuncioDomainEntity.class)))
                .thenReturn(anuncioEntity);

        // Mock do comportamento do S3
        when(s3Service.uploadFile(any(MultipartFile.class)))
                .thenReturn(CompletableFuture.completedFuture("http://mocked-url.com/image1"));

        // Chamada do método
        AnuncioResponseDTO anuncioSalvo = anuncioService.criarAnuncio(anuncioRequestDTO, imagens);

        // Verificações
        assertNotNull(anuncioSalvo);
        assertEquals(1L, anuncioSalvo.getAnuncioId());
        verify(anuncioRepository, times(2)).save(any(AnuncioDomainEntity.class));
    }

    @Test
    void criarAnuncio_deveLancarExcecao_quandoFalhaNoUploadDeImagens() throws IOException {
        // Mock do request DTO e da lista de imagens
        AnuncioRequestDTO anuncioRequestDTO = new AnuncioRequestDTO();
        List<MultipartFile> imagens = List.of(mock(MultipartFile.class));

        // Mock do comportamento do repositório
        when(anuncioRepository.save(any(AnuncioDomainEntity.class))).thenReturn(new AnuncioDomainEntity());

        // Mock para lançar exceção no upload
        when(s3Service.uploadFile(any(MultipartFile.class))).thenThrow(new IOException("Erro no upload"));

        // Chamada do método e captura da exceção
        Exception exception = assertThrows(RuntimeException.class,
                () -> anuncioService.criarAnuncio(anuncioRequestDTO, imagens));

        // Verificações
        assertEquals("Erro ao fazer upload da imagem", exception.getMessage());
        verify(anuncioRepository, times(1)).save(any(AnuncioDomainEntity.class)); // Apenas a primeira chamada para salvar
    }

    @Test
    void criarAnuncio_deveLancarExcecao_quandoFalhaAoSalvarAnuncio() {
        // Mock do request DTO e lista de imagens
        AnuncioRequestDTO anuncioRequestDTO = new AnuncioRequestDTO();
        List<MultipartFile> imagens = List.of(mock(MultipartFile.class));

        // Mock para lançar exceção ao salvar o anúncio
        when(anuncioRepository.save(any(AnuncioDomainEntity.class))).thenThrow(new RuntimeException("Erro ao salvar anúncio"));

        // Chamada do método e captura da exceção
        Exception exception = assertThrows(RuntimeException.class, () -> {
            anuncioService.criarAnuncio(anuncioRequestDTO, imagens);
        });

        // Verificações
        assertEquals("Erro ao salvar anúncio", exception.getMessage());
        verify(anuncioRepository, times(1)).save(any(AnuncioDomainEntity.class));
    }

    @Test
    void consultarAnuncio_deveRetornarAnuncio_quandoEncontrado() {
        // Mock da entidade de anúncio
        AnuncioDomainEntity anuncioEntity = new AnuncioDomainEntity();
        anuncioEntity.setId(1L);

        // Mock do comportamento do repositório
        when(anuncioRepository.findById(1L)).thenReturn(Optional.of(anuncioEntity));

        // Chamada do método
        final var response = anuncioService.consultarAnuncio(1L);

        // Verificações
        assertNotNull(response);
        assertEquals(1L, response.getAnuncioId());
        verify(anuncioRepository, times(1)).findById(1L);
    }

    @Test
    void consultarAnuncio_deveRetornarNull_quandoAnuncioNaoEncontrado() {
        // Mock para retornar vazio
        when(anuncioRepository.findById(1L)).thenReturn(Optional.empty());

        // Chamada do método
        final var response = anuncioService.consultarAnuncio(1L);

        // Verificações
        assertNull(response);
        verify(anuncioRepository, times(1)).findById(1L);
    }

    @Test
    void listarAnunciosPaginadosComFiltros_deveRetornarAnuncios_quandoSucesso() {
        // Mock da página de anúncios
        final var pageAnuncios = new PageImpl<>(List.of(new AnuncioDomainEntity()), PageRequest.of(0, 10), 1);

        // Mock do comportamento do repositório
        when(anuncioRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(pageAnuncios);

        // Chamada do método
        final var response = anuncioService.listarAnunciosPaginadosComFiltros(0, 10, null, null, null, null, null, null, null, null , null, null);

        // Verificações
        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        verify(anuncioRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void listarAnunciosPaginadosComFiltros_deveAplicarFiltrosAdequadamente() {
        // Mock da página de anúncios
        final var pageAnuncios = new PageImpl<>(List.of(new AnuncioDomainEntity()), PageRequest.of(0, 10), 1);

        // Mock do comportamento do repositório
        when(anuncioRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(pageAnuncios);

        // Chamada do método com filtros aplicados
        final var response = anuncioService.listarAnunciosPaginadosComFiltros(0, 10, "Toyota", "Corolla", "Carro", 50000.0, 100000.0, 2020, "motor", "dataCriacao", "asc", TipoAnuncioPesquisa.AMBOS);

        // Verificações
        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        verify(anuncioRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }
}
